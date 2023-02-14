import { Router, json } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";

import { validateCreateGather } from "../middleware/gather/verifyCreateGatherBody.js";
import isMapValid from "../functions/isMapValid.js";
import { User } from "../db/models/user.js";
import { validateToken } from "../middleware/user/validateToken.js";
import { isModerator } from "../middleware/roles/isModerator.js";
import { verifyEditGather } from "../middleware/gather/verifyEditGather.js";
import { isManager } from "../middleware/roles/isManager.js";
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

// DELETE single gathers
router.delete("/gather/delete/:id", validateToken,isManager ,async (req, res) => {
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

//api/gather/edit
router.post(
  "/gather/edit/:id",
  verifyEditGather,
  validateToken,
  isModerator,
  async (req, res) => {
    const body = _.pick(req.body, "map", "maxPlayers", "status", "players");
    const id = req.params.id;
    let MapValidTest: boolean = isMapValid(body.map, maps);
    async function updateGather() {
      const filter = { _id: id };
      const update = {
        map: body.map,
        maxPlayers: body.maxPlayers,
        status: body.status,
        players: body.players,
      };
      const options = { new: true };
      // map, maxplayers, players, status;
      const result = await Gather.findOneAndUpdate(filter, update, options);
      await result.save();
    }

    try {
      if (!MapValidTest) {
        res.json({
          message: "Invalid map! you need to choose one of real map",
        });
      } else {
        //for each gather -> save the role id of gather

        updateGather();
        return res.json({
          message: "Gather edited!",
        });
      }
    } catch (e) {
      return res.status(500).json({ message: "Server DB Error", error: e });
    }
  }
);

router.delete("/gather/deleteAll",validateToken,isModerator, async (req, res) => {
  try {
    await Gather.deleteMany({});
    res.json({ message: `All gathers are deleted!` });
  } catch (error) {
    console.log(error.message);
  }
});
const checkIfExistPlayer = (string, arr) => {
  let isTrue = false;
  arr.forEach((value, index) => {
    if (string === value.userId.toString()) {
      isTrue = true;
    }
  });
  return isTrue;
};

export { router as moderatorRouter };
