import { Router } from "express";
import _ from "underscore";
import { User } from "../db/models/user.js";
import { validateSignUp } from "../middleware/verifySignupBody.js";
import { userAlreadyExists } from "../middleware/userAlreadyExists.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateSignIn } from "../middleware/verifySignInBody.js";
import { Role } from "../db/models/role.js";
import authConfig from "../db/config/auth.config.js";
const router = Router();

const createJwtToken = (_id) => {
  return jwt.sign({ _id }, authConfig.secret_key, { expiresIn: `30d` });
};

//api/auth/signup
router.post("/signup", validateSignUp, userAlreadyExists, async (req, res) => {
  const body = _.pick(req.body, "username", "email", "password");

  //12 rounds takes more
  body.password = await bcrypt.hash(body.password, 12);
  //save the password hash to db:
  const { username, email, password } = req.body;
  const user = new User(username, email, password);

  try {
    user.roles = [await (await Role.findOne({ name: "user" }))._id];

    await user.save();

    return res.json({ message: "user saved", id: user._id });
  } catch (e) {
    return res.status(500).json({ message: "Server DB Error", error: e });
  }
});

router.post("/signin", validateSignIn, async (req, res) => {
  //email and password:
  try {
    const user = await User.findOne({ username: req.body.username }).populate(
      "roles"
    );

    if (!user) {
      return res.status(401).json({ message: "No Such User" });
    }

    //123*12
    //verify body.password matches user.password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createJwtToken(user._id);

    const authorities = [];
    for (let i = 0; i < user.roles.length; i++) {
      authorities.push(`ROLE_` + user.roles[i].name.toUpperCase());
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (e) {
    return res.status(500).json({ message: "Sign in error", error: e });
  }
});

export { router as authRouter };
