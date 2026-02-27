import express from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: { userEmail: string };
        }
    }
}

export function jwtMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const segredo = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, segredo!) as { userEmail: string };
        req.user = decoded;
    } catch (err) {
        res.status(401).send("Unauthorized");
        return;
    }

    next();
}