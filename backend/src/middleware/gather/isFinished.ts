import { RequestHandler } from "express";
import { Role } from "../../db/models/role.js";
import { User } from "../../db/models/user.js";
const isFinished: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  const gatherId = req.params.gatherId;
  console.log(gatherId)
};

export { isFinished };
