import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";

import { User } from "../db/models/user.js";
import { validateToken } from "../middleware/user/validateToken.js";
import nodeEvents from "../nodeEvents/nodeEvents.js";
import shouldGameStart from "../../dist/functions/checkIfExistPlayer.js";

const checkIfExistPlayerFunction = (string, arr) => {
  let isTrue = false;
  arr?.forEach((value, index) => {
    if (string === value.userId.toString()) {
      isTrue = true;
    }
  });
  return isTrue;
};

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

// // POST Start gather
// router.post("/startGather/:gatherId", async (req, res) => {
//   function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

//   try {
//     const gatherId = req.params.gatherId;

//     const gather = await Gather.findOne({ _id: gatherId });

//     const shuffeledArray = await shuffleArray(gather.players);

//     const middleIndex = Math.ceil(shuffeledArray.length / 2);

//     const teamA = await shuffeledArray.splice(0, middleIndex);
//     const teamB = await shuffeledArray.splice(-middleIndex);
//     const teams = [{ TeamA: teamA, TeamB: teamB }];

//     const updatedGather = await Gather.findOneAndUpdate(
//       { _id: gatherId },
//       { $push: { teams: teams } }
//     );
//     console.log(updatedGather);

//     res.json({ message: `Gather started!`, gather: gather });

//     return nodeEvents.emit("update");
//   } catch (error) {
//     console.log(error.message);
//   }
// });
// POST Push some random players to teams for testing
router.post("/pushTestPlayers/:gatherId", async (req, res) => {
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
});

// GET all gathers
router.get("/", async (req, res) => {
  try {
    const gathers = await Gather.find();
    if (!gathers) return;
    res.json(gathers);
  } catch (error) {
    console.log(error);
  }
});

// Example usage
// GET single gathers
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const gather = await Gather.findOne({ _id: id });
    if (!gather) return;
    res.status(200).json(gather);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error });
  }
});

const shouldGameStart = async (id) => {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const gather = await Gather.findOne({ _id: id });
  console.log(gather);
  if (gather.players.length === gather.maxPlayers) {
    try {
      const shuffeledArray = await shuffleArray(gather.players);
      console.log(`shuffeledArray`, shuffeledArray);
      const middleIndex = Math.ceil(shuffeledArray.length / 2);
      const teamA = await shuffeledArray.splice(0, middleIndex);
      const teamB = await shuffeledArray.splice(-middleIndex);
      const teams = [{ TeamA: teamA, TeamB: teamB }];
      console.log(teams);
      const updatedGather = await Gather.findOneAndUpdate(
        { _id: id },
        { $push: { teams: teams } }
      );
      console.log(updatedGather);
      return nodeEvents.emit("update");
    } catch (error) {
      console.log(error);
    }
  }
};

//api/gather/add
router.post("/add/:gatherId", validateToken, async (req, res) => {
  try {
    const gatherId = req.params.gatherId;
    await shouldGameStart(gatherId);

    const userId = req.userId;

    const user = await User.findById(userId);

    const gather = await Gather.findById(gatherId);

    const checkExistPlayer = checkIfExistPlayerFunction(
      user._id.toString(),
      gather.players
    );

    if (checkExistPlayer === true)
      return res.json({ error: `User already joined` });

    await Gather.updateOne(
      { _id: gatherId },
      {
        $push: {
          players: { userName: user.username, userId: user._id.toString() },
        },
      }
    );
    shouldGameStart(gatherId);
    res.json({ message: `Success!`, userName: user.username });

    return nodeEvents.emit("update");
  } catch (error) {
    console.log(error.message);
  }
});

//api/gather/leavequeue
router.delete("/leaveQueue/:gatherId", validateToken, async (req, res) => {
  try {
    const gatherId = await req.params.gatherId;
    const userId = await req.userId;

    const user = await User.findById(userId);

    const gather = await Gather.findById(gatherId);

    const checkExistPlayerState = checkIfExistPlayerFunction(
      user._id.toString(),
      gather.players
    );

    if (checkExistPlayerState === false)
      return res.json({ error: `User is not in the queue !` });

    await Gather.updateOne(
      { _id: gatherId },
      {
        $pull: {
          players: { userName: user.username, userId: user._id.toString() },
        },
      }
    );

    res.json({ message: `Success!`, userName: user.username });
    return nodeEvents.emit("update");
  } catch (error) {
    console.log(error.message);
  }
});

export { router as gatherRouter };
