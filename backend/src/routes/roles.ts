import { Router } from "express";

import _ from "underscore";
import { User } from "../db/models/user.js";
import { Role } from "../db/models/role.js";
import { roleAddValidate } from "../middleware/roles/roleAdd.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { validateToken } from "../middleware/user/validateToken.js";

const router = Router();

// router.delete("/deleteAll", async (req, res) => {
//   try {
//     await User.deleteMany({});
//     await res.json({ message: `All gathers are deleted!` });
//   } catch (error) {
//     console.log(error.message);
//   }
// });

//api/auth/signup
router.post(
  "/add",
  validateToken,
  roleAddValidate,
  isModerator,
  async (req, res) => {
    const body = _.pick(req.body, "username", "role");

    let user = await await User.findOne({ username: body.username });

    //before saving the user:
    try {
      user.roles = [(await Role.findOne({ name: body.role }))._id];
      //for each user -> save the role id of user
      // user.roles.push({role._id});
      // await user.updateOne({}, { roles: role });
      // 63e076299e5e78d39dac54e4
      // 63e076299e5e78d39dac54e2
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

router.get("/all", validateToken, (req, res) => {
  res.json([{ title: "Hunger Games" }]);
});

// router.post("/signin", validateSignIn, async (req, res) => {
//   //email and password:
//   try {
//     //SELECT * FROM user JOIN Roles ON ...
//     const user = await User.findOne({ email: req.body.email }).populate<{
//       roles: Array<typeof Role>;
//     }>("roles");

//     if (!user) {
//       return res.status(401).json({ message: "No Such User" });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }

//     const token = jwt.sign({ id: user.id }, authConfig.secret, {
//       expiresIn: "30d",
//     });

//     const authorities = [];
//     for (let i = 0; i < user.roles.length; i++) {
//       authorities.push(`ROLE_` + user.roles[i].name.toUpperCase());
//     }

//     return res.status(200).json({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       roles: authorities,
//       accessToken: token,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: "Server error", error: e });
//   }
// });

export { router as roleRouter };
