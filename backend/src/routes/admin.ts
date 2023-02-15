import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";
import { validateCreateGather } from "../middleware/gather/verifyCreateGatherBody.js";
import isMapValid from "../functions/isMapValid.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { validateToken } from "../middleware/user/validateToken.js";
import { isManager } from "../middleware/roles/isManager.js";
import nodeEvents from "../nodeEvents/nodeEvents.js";

const router = Router();
const maps = [
  "ascent",
  "split",
  "haven",
  "bind",
  "icebox",
  "breeze",
  "fracture",
  "pearl",
  "lotus",
];

//api/admin/create
router.post(
  "/gather/create",
  validateCreateGather,
  validateToken,
  isManager,
  async (req, res) => {
    const body = _.pick(req.body, "map", "maxPlayers");
    let MapValidTest: boolean = isMapValid(body.map.toLowerCase(), maps);

    const newDate = new Date();
    //before saving the gather:
    const gather = new Gather({
      map: body.map.toLowerCase(),
      maxPlayers: body.maxPlayers,
      date: newDate,
      onGoing: true,
      players: [],
      teams: [],
      finished: false,
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
          "players",
          "teams"
        );
        res.json({
          message: "Gather created!",
          ...gatherDetails,
        });
        return nodeEvents.emit("update");
      }
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);

//api/admin/deletePlayerFromQueue
router.delete(
  "/gather/deletePlayerFromQueue/:gatherId/:userId",
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const gatherId = req.params.gatherId;
      console.log(gatherId, userId);
      const gather = await Gather.updateOne(
        { _id: gatherId },
        { $pull: { players: { userId: userId } } }
      );

      res.json({ message: `Success!` });
      return nodeEvents.emit("update");
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/updateMap
router.post(
  "/gather/updateMap/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const body = _.pick(req.body, "map");

      const gatherId = req.params.gatherId;
      let checkMapValid = isMapValid(body.map.toLowerCase(), maps);
      if (checkMapValid === true) {
        const gather = await Gather.updateOne(
          { _id: gatherId },
          { map: body.map.toLowerCase() }
        );

        res.json({ message: `Success!` });
        return nodeEvents.emit("update");
      }
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/updateMaxPlayers
router.post(
  "/gather/updateMaxPlayers/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const body = _.pick(req.body, "maxPlayers");

      const gatherId = req.params.gatherId;

      const gather = await Gather.updateOne(
        { _id: gatherId },
        { maxPlayers: body.maxPlayers }
      );

      res.json({ message: `Success!` });
      return nodeEvents.emit("update");
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);
//api/admin/updateStatus
router.post(
  "/gather/updateStatus/:gatherId",
  validateToken,
  isModerator,
  async (req, res) => {
    try {
      const body = _.pick(req.body, "status");

      const gatherId = req.params.gatherId;

      const gather = await Gather.updateOne(
        { _id: gatherId },
        { onGoing: body.status }
      );

      res.json({ message: `Success!` });
      return nodeEvents.emit("update");
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);

//When gather is finished
router.post("/finishGather/:gatherId", async (req, res) => {
  try {
    const gatherId = req.params.gatherId;
    const body = _.pick(req.body, "matchPicture");
    const gather = await Gather.findOneAndUpdate(
      { _id: gatherId },
      { finished: true }
    );
  } catch (error) {
    console.log(error);
  }
});

export { router as adminRouter };
