import type { Request, Response } from "express";

const installRedirect = (_req: Request, res: Response) => {
  const url = `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`;
  res.redirect(url);
};

const installationCallback = async (req: Request, res: Response) => {
  const installationId = req.query.installation_id;

  if (!installationId) {
    return res.status(400).send("No installation_id provided");
  }

  // Later: save installation ID for the user
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?installed=true`);
};

export { installRedirect, installationCallback };
