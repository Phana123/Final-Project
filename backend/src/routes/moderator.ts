import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";
import nodeEvents from "../nodeEvents/nodeEvents.js";
import { validateToken } from "../middleware/user/validateToken.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { isManager } from "../middleware/roles/isManager.js";
import { User } from "../db/models/user.js";

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

// DELETE single gathers
router.delete(
  "/gather/delete/:id",
  validateToken,
  isManager,
  async (req, res) => {
    const id = req.params.id;
    try {
      await Gather.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: `Successfully deleted`,
      });
      return nodeEvents.emit("update");
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Failed to delete`,
      });
    }
  }
);

router.delete(
  "/gather/deleteAll",
  validateToken,
  isManager,
  async (req, res) => {
    try {
      await Gather.deleteMany({});
      res.json({ message: `All gathers are deleted!` });
      return nodeEvents.emit("update");
    } catch (error) {
      console.log(error.message);
    }
  }
);
const checkIfExistPlayer = (string, arr) => {
  let isTrue = false;
  arr?.forEach((value, index) => {
    if (string === value.userId.toString()) {
      isTrue = true;
    }
  });
  return isTrue;
};

router.post(
  "/gather/pushTestPlayers/:gatherId",
  validateToken,
  isManager,
  async (req, res) => {
    try {
      const gatherId = req.params.gatherId;
      const playersArray = [];
      req.body?.body.forEach((value) => {
        playersArray.push(value);
      });
      Gather.findByIdAndUpdate(
        gatherId,
        { $push: { players: { $each: playersArray } } },
        (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        }
      );

      res.json({ message: `Gather started!` });
      return nodeEvents.emit("update");
    } catch (error) {
      console.log(error.message);
    }
  }
);
router.post("/gather/pushRandomScoreTest/:gatherId", async (req, res) => {
  try {
    // let scoreObject = {kill:null,death:null,assist:null}
    let scoreObject = { kill: null, death: null, assist: null };
    for (let user of req.body) {
      scoreObject.kill = user.kill;
      scoreObject.death = user.death;
      scoreObject.assist = user.assist;
      const updatedUser = await User.updateOne(
        { _id: user.userId },
        { $set: { score: scoreObject } }
      );
      console.log(scoreObject);
    }
  } catch (error) {
    console.log(error);
  }
});


export { router as moderatorRouter };
