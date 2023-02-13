import { Router, json } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";
import { User } from "../db/models/user.js";
import { validateCreateGather } from "../middleware/gather/verifyCreateGatherBody.js";
import isMapValid from "../functions/isMapValid.js";
import { isAdmin } from "../middleware/roles/isAdmin.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { validateToken } from "../middleware/user/validateToken.js";

// import checkIfExistPlayer from "../../dist/functions/checkIfExistPlayer.js";
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

//api/admin/create
router.post(
  "/create",
  validateCreateGather,
  validateToken,
   isModerator,
  async (req, res) => {
    const body = _.pick(req.body, "map", "maxPlayers");
    let MapValidTest: boolean = isMapValid(body.map, maps);

    const newDate = new Date();
    //before saving the gather:
    const gather = new Gather({
      map: body.map,
      maxPlayers: body.maxPlayers,
      date: newDate,
      onGoing: true,
      players: [],
    });

    try {
      if (!MapValidTest) {
        res.json({
          message: "Invalid map! you need to choose one of real map",
        });
      } else {
        //for each gather -> save the role id of gather

        await gather.save();
        const gatherDetails = _.pick(
          gather,
          "map",
          "date",
          "maxPlayers",
          "onGoing",
          "_id",
          "players"
        );
        return res.json({
          message: "Gather created!",
          ...gatherDetails,
        });
      }
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/deletePlayerFromQueue
router.delete(
  "/deletePlayerFromQueue/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const userId = await req.userId;
      const gatherId = await req.params.gatherId;
      const user = await User.findOne({ _id: userId });

      const gather = await Gather.updateOne(
        { _id: gatherId },
        { $pull: { players: { userId: userId } } }
      );

      return res.json({ message: `Success!` });
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/updateMap
router.post(
  "/updateMap/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const body = _.pick(req.body, "map");

      const gatherId = await req.params.gatherId;
      let checkMapValid = isMapValid(body.map, maps);
      if (checkMapValid === true) {
        const gather = await Gather.updateOne(
          { _id: gatherId },
          { map: body.map }
        );

        return res.json({ message: `Success!` });
      }
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/updateMaxPlayers
router.post(
  "/updateMaxPlayers/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const body = _.pick(req.body, "maxPlayers");

      const gatherId = await req.params.gatherId;

      const gather = await Gather.updateOne(
        { _id: gatherId },
        { maxPlayers: body.maxPlayers }
      );

      return res.json({ message: `Success!` });
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/updateStatus
router.post(
  "/updateStatus/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const body = _.pick(req.body, "status");

      const gatherId = await req.params.gatherId;

      const gather = await Gather.updateOne(
        { _id: gatherId },
        { onGoing: body.status }
      );

      return res.json({ message: `Success!` });
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);

export { router as adminRouter };
