import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";

const generateAppJWT = async() => {
    const privateKey = fs.readFileSync(process.env.GITHUB_APP_PRIVATE_KEY!, 'utf8');

    const now = Math.floor(Date.now() / 1000);

    return jwt.sign(
        {
            iat: now,
            exp: now + 540, // 9 minutes
            iss: process.env.GITHUB_APP_ID,
        },
        privateKey,
        { algorithm: 'RS256' }
    );
}

const getInstallationToken = async(installationId: number) => {
    const appJWT = await generateAppJWT();

    const response = await axios.post(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {},
        {
            headers: {
                Authorization: `Bearer ${appJWT}`,
                Accept: 'application/vnd.github+json',
            },
        }
    );

    return response.data.token;
}

export { generateAppJWT, getInstallationToken };