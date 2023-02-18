import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";
import { validateCreateGather } from "../middleware/gather/verifyCreateGatherBody.js";
import isMapValid from "../functions/isMapValid.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { validateToken } from "../middleware/user/validateToken.js";
import nodeEvents from "../nodeEvents/nodeEvents.js";
import multer from "multer";
import { isAdmin } from "../middleware/roles/isAdmin.js";
import { isManager } from "../middleware/roles/isManager.js";
import { User } from "../db/models/user.js";

// Create a multer object with some options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
  isAdmin,
  async (req, res) => {
    const body = _.pick(req.body, "map", "maxPlayers");
    let MapValidTest: boolean = isMapValid(body.map.toLowerCase(), maps);

    const newDate = new Date();
    //before saving the gather:
    const gather = new Gather({
      map: body.map.toLowerCase(),
      maxPlayers: body.maxPlayers,
      date: newDate,
      onGoing: false,
      players: [],
      teams: [],
      finished: false,
      waitingForPlayers: true,
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
  validateToken,
  isAdmin,
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
router.post(
  "/gather/finishGather/:gatherId",
  upload.single("image"),
  validateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const gatherId = req.params.gatherId;
      const gather = await Gather.findOneAndUpdate(
        { _id: gatherId },
        {
          finished: true,
          onGoing: false
        }
      );
    } catch (error) {
      console.log(`something wrong here`);
    }
  }
);

//When admin update score after finish
router.post(
  //moderator/insertScore/gatherId
  "/gather/insertScore/:gatherId/",
  validateToken,

  async (req, res) => {
    try {
      const body = _.pick(req.body, "userId", "kill", "death", "assist");
      const gatherId = req.params.gatherId
      const gather = await Gather.findOne({ _id: gatherId })
      if (gather.players.length === gather.maxPlayers) {

      }
      const updateUser = await User.findOneAndUpdate(
        { _id: body.userId },
        {
          $inc: {
            "score.kill": body.kill,
            "score.death": body.death,
            "score.assist": body.assist,
            "score.points": 22,
          },
        }
      );
      res.json({
        message: `User ${updateUser.username} updated successfully!`,
      });
      return nodeEvents.emit("update");
    } catch (error) {
      console.log(error);
    }
  }
);

// <<------------------- Gather Score when End ---------------->>
router.post(
  //moderator/insertScore/gatherId
  "/gather/submitGather/:gatherId/",
  validateToken,
  async (req, res) => {
    try {
      const gatherId = req.params.gatherId;
      const filter = { _id: gatherId };
      const update = {
        $push: { score: req.body },
        finished: true,
        onGoing: false,
      };
      const options = { new: true }; // This option returns the updated document

      await Gather.findOneAndUpdate(filter, update)
        .then((updatedDocument) => {
          console.log(updatedDocument);
          res.json({ message: `Success, gather is ended` });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    return nodeEvents.emit("update");
  }
);

export { router as adminRouter };
