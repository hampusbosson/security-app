import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const githubWebhook = async (req: Request, res: Response) => {
    const event = req.headers['x-github-event'];

    console.log("webhook event received: ", event);

    if (event === 'installation') {
        const action = req.body.action;
        const installationId = req.body.installation?.id;
        
        if (action == 'deleted') {
            console.log("Installation removed: ", installationId);
            
            await prisma.installation.deleteMany({
                where: { installationId }
            });

            res.status(200).send("Installation deleted");
            return;
        }
    }

    res.status(200).send("Event ignored");
}