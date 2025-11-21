import type { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

const loginUser = (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID!,
    redirect_uri: process.env.GITHUB_OAUTH_CALLBACK!,
    scope: "read:user user:email",
  });

  console.log("Redirect uri: ", process.env.GITHUB_OAUTH_CALLBACK);

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

const authorizeUser = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send("No code provided");
    return;
  }

  try {
    // 1) Exchange code for access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_OAUTH_CALLBACK,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      res.status(400).send("Failed to obtain access token");
      return;
    }

    // 2) Use access token to get user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userRes.data;

    // 3) Fetch user email
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const primaryEmail =
      emailRes.data.find((e: any) => e.primary)?.email || null;

    // 4) Create session token
    const appToken = jwt.sign(
      {
        id: githubUser.id,
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        email: primaryEmail,
        githubAccessToken: accessToken, // optionally store
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    //TODO: Save user to DB

    // 5) Redirect user to frontend with JWT
    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${appToken}`
    );
  } catch (error) {
    console.error("Error during Oauth callback:", error);
    res.status(500).send("Internal Server Error");
  }
};


export { loginUser, authorizeUser };