import { Router } from "express";

import _ from "underscore";
import { User } from "../db/models/user.js";
import { Role } from "../db/models/role.js";
import { roleAddValidate } from "../middleware/roles/roleAdd.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { validateToken } from "../middleware/user/validateToken.js";

const router = Router();

router.post(
  "/add",
  validateToken,
  roleAddValidate,
  isModerator,
  async (req, res) => {
    const body = _.pick(req.body, "username", "role");

    let user = await await User.findOne({ username: body.username });

    try {
      user.roles = [(await Role.findOne({ name: body.role }))._id];

      await user.save();
      return res.json({
        message: `Role ${body.role} added to ${body.username}`,
        id: user._id,
      });
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);

export { router as roleRouter };
