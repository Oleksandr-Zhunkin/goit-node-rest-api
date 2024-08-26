import { isValidObjectId } from "mongoose";

import HttpError from "../helpers/HttpError.js";

export const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} is not valid id`));
  }

  next();
};

export const isValidFavorite = (req, res, next) => {
  const { favorite } = req.body;

  if (favorite !== "true" && favorite !== "false") {
    return next(HttpError(404, `${favorite} is not boolean`));
  }

  next();
};
