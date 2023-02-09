import { RequestHandler } from "express";
import { User } from "../db/models/user.js";
import { Role } from "../db/models/role.js";

const isModerator: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    //join like:
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let role of roles) {
      if (role.name === "moderator") {
        return next();
      }
    }

    return res.status(403).json({ message: "Requires moderator role" });
  } catch (error) {
    return res.status(500).json({ message: "Requires moderator role" });
  }

  //FIND THE USER ROLE => IF moderator
};

export { isModerator };
