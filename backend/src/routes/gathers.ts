import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";

import { User } from "../db/models/user.js";
import { validateToken } from "../middleware/user/validateToken.js";
import nodeEvents from "../nodeEvents/nodeEvents.js";

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

// GET all gathers
router.get("/", async (req, res) => {
  try {
    const gathers = await Gather.find().sort({ _id: -1 });
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
  if (gather.players.length === gather.maxPlayers) {
    try {
      const shuffeledArray = await shuffleArray(gather.players);
      const middleIndex = Math.ceil(shuffeledArray.length / 2);
      const teamA = await shuffeledArray.splice(0, middleIndex);
      const teamB = await shuffeledArray.splice(-middleIndex);
      const teams = [{ TeamA: teamA, TeamB: teamB }];
      const updatedGather = await Gather.findOneAndUpdate(
        { _id: id },
        { $push: { teams: teams }, onGoing: true, waitingForPlayers: false }
      );
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

// <------------- api/gather/isJoined ? ------------->
router.get("/isJoined/:gatherId/:userName", async (req, res) => {
  try {
    const userName = req.params.userName
    const gatherId = req.params.gatherId

    const gather = await Gather.findOne({ _id: gatherId })
    const isJoined = gather.players.some(item => item.userName === userName)
    res.json({ isJoined: isJoined })
    return nodeEvents.emit("update");
  } catch (error) {
    console.log(error)
  }
})
// <-------------- api/gather/isFinished ? --------------->
router.get("/isFinished/:gatherId", async (req, res) => {
  try {
    const gatherId = req.params.gatherId
    let isFinished = false;
    const gather = await Gather.findOne({ _id: gatherId })
    if (gather.finished === true) {
      isFinished = true
    } else if (gather.finished === false) {
      isFinished = false
    } else {
      console.log(`There is no isFinished key in gather database`)
    }
    res.json({ isFinished: isFinished })
    return nodeEvents.emit("update");
  } catch (error) {
    console.log(error)
  }
})

export { router as gatherRouter };
