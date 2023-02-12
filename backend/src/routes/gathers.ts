import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";

import { validateCreateGather } from "../middleware/verifyCreateGatherBody.js";
import isMapValid from "../functions/isMapValid.js";
const router = Router();
const maps = [
  "Ascent",
  "Split",
  "Haven",
  "Bind",
  "Icebox",
  "Breeze",
  "Fracture",
  "Pearl",
  "Lotus",
];

// GET all gathers
router.get("/", (req, res) => {
  Gather.find()
    .then((gathers) => {
      res.json(gathers);
    })
    .catch((e) => res.status(500).json({ message: "Error", error: e }));
});

// GET single gathers
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Gather.findOne({ _id: id })
    .then((gather) => {
      res.json(gather);
    })
    .catch((e) => res.status(500).json({ message: "Error", error: e }));
});

// DELETE single gathers
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Gather.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `Successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to delete`,
    });
  }
});

//api/auth/signup
router.post("/create", validateCreateGather, async (req, res) => {
  const body = _.pick(req.body, "map", "maxPlayers");
  let MapValidTest: boolean = isMapValid(body.map, maps);

  const newDate = new Date();
  //before saving the gather:
  const gather = new Gather({
    map: body.map,
    maxPlayers: body.maxPlayers,
    date: newDate,
    onGoing: true,
  });

  try {
    if (!MapValidTest) {
      res.json({ message: "Invalid map! you need to choose one of real map" });
    } else {
      //for each gather -> save the role id of gather

      await gather.save();
      const gatherDetails = _.pick(
        gather,
        "map",
        "date",
        "maxPlayers",
        "onGoing",
        "_id"
      );
      return res.json({
        message: "Gather created!",
        ...gatherDetails,
      });
    }
  } catch (e) {
    return res.status(500).json({ message: "Server DB Error", error: e });
  }
});

router.delete("/deleteAll", async (req, res) => {
  try {
    await Gather.deleteMany({});
    res.json({ message: `All gathers are deleted!` });
  } catch (error) {
    console.log(error.message);
  }
});

// router.post("/signin", async (req, res) => {
//   //email and password:
//   try {
//     //SELECT * FROM gather JOIN Roles ON ...
//     const gather = await gather.findOne({ _id: req.body.email }).populate<{
//       roles: Array<typeof Role>;
//     }>("roles");

//     if (!gather) {
//       return res.status(401).json({ message: "No Such gather" });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       req.body.password,
//       gather.password
//     );

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }

//     const token = jwt.sign({ id: gather.id }, authConfig.secret, {
//       expiresIn: "30d",
//     });

//     const authorities = [];
//     for (let i = 0; i < gather.roles.length; i++) {
//       authorities.push(`ROLE_` + gather.roles[i].name.toUpperCase());
//     }

//     return res.status(200).json({
//       id: gather.id,
//       gathername: gather.gathername,
//       email: gather.email,
//       roles: authorities,
//       accessToken: token,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: "Server error", error: e });
//   }
// });

export { router as gatherRouter };
