import { RequestHandler } from "express";
import _ from "underscore";
import { startGatherSchema } from "../../validators/gathers.js";

const verifyStartGather: RequestHandler = (req, res, next) => {
  const body = _.pick(req.body, "teamA", "teamB");

  const { error } = startGatherSchema.validate(body);

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((ed) => ed.message),
    });
  }

  next();
};

export { verifyStartGather };
