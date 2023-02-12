import { RequestHandler } from "express";
import _ from "underscore";

import { roleAddSchema } from "../../validators/roles.js";

const roleAddValidate: RequestHandler = (req, res, next) => {
  const body = _.pick(req.body, "username", "role");

  const { error } = roleAddSchema.validate(body);

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((ed) => ed.message),
    });
  }

  next();
};

export { roleAddValidate };
