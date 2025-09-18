import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err, "Unhandled error occurred");

  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ error: err.issues.map((issue) => issue.message) });
  }

  res.status(500).json({ error: err.message || "Internal Server Error" });
};
