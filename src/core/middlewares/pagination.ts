import { NextFunction, Request, Response } from "express";

import { PAGINATION_LIMIT } from "config"

export const paginationMiddleware = (req: Request, _: Response, next: NextFunction): void => {
  if (Number(req.query.limit) > PAGINATION_LIMIT || Number(req.query.limit) < 1) {
    req.query.limit = String(PAGINATION_LIMIT);
  }
  if (!req.query.offset || Number(req.query.offset) < 0) {
    req.query.offset = "0";
  }

  next();
}
