import { RequestHandler } from "express";
import _ from "underscore";
import { createGatherSchema } from "../../validators/gathers.js";

const validateCreateGather: RequestHandler = (req, res, next) => {
  const body = _.pick(req.body, "date", "map", "maxPlayers");

  const { error } = createGatherSchema.validate(body);

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((ed) => ed.message),
    });
  }

  next();
};

export { validateCreateGather };
