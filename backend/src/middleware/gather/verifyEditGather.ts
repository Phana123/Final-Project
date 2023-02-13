import { RequestHandler } from "express";
import _ from "underscore";
import { editGatherSchema } from "../../validators/gathers.js";

const verifyEditGather: RequestHandler = (req, res, next) => {
  const body = _.pick(req.body, "status", "players", "map", "maxPlayers");

  const { error } = editGatherSchema.validate(body);

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((ed) => ed.message),
    });
  }

  next();
};

export { verifyEditGather };
