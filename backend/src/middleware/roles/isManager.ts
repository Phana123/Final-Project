import { RequestHandler } from "express";
import { Role } from "../../db/models/role.js";
import { User } from "../../db/models/user.js";
const isManager: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let role of roles) {
      if (role.name === "moderator" || "admin" ) {
        return next();
      }
    }
    return res.status(403).json({ message: "Requires manager Role" });
  } catch (e) {
    return res.status(500).json({ message: "Requires manager Role", error: e });
  }
};

export { isManager };
