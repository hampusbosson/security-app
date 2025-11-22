import "express";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        userId: number;
        username: string;
        avatar?: string;
        email?: string;
      };
    }
  }
}

export {};