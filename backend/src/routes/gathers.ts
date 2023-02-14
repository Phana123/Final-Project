import { Router } from "express";
import _ from "underscore";
import { Gather } from "../db/models/gather.js";

import { User } from "../db/models/user.js";
import { validateToken } from "../middleware/user/validateToken.js";

const checkIfExistPlayerFunction = (string, arr) => {
  let isTrue = false;
  arr.forEach((value, index) => {
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

// POST Start gather
router.post("/startGather/:gatherId", async (req, res) => {
  try {
    const gatherId = req.params.gatherId;
    const { teamA, teamB } = await req.body;
    console.log(req.body)
    const gather = await Gather.findOneAndUpdate(
      { _id: gatherId },
      {
        $push: {
          teams: {
            teamA,
            teamB,
          },
        },
      }
    );

    console.log(gather);
    return res.json({ message: `Gather started!`, gather: gather });
  } catch (error) {
    console.log(error.message);
  }
});
// POST Push some random players to teams for testing
router.post("/pushTestPlayers/:gatherId", async (req, res) => {
  try {
    const gatherId = req.params.gatherId;
    const playersArray = [];
    req.body.body.forEach((value) => {
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

    return res.json({ message: `Gather started!` });
  } catch (error) {
    console.log(error.message);
  }
});

// GET all gathers
router.get("/", (req, res) => {
  Gather.find()
    .then((gathers) => {
      res.json(gathers);
    })
    .catch((e) => res.status(500).json({ message: "Error", error: e }));
});

// Example usage
// GET single gathers
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  Gather.findOne({ _id: id })
    .then((gather) => {
      res.json(gather);
    })

    .catch((e) => res.status(500).json({ message: "Error", error: e }));
});

//api/gather/add
router.post("/add/:gatherId", validateToken, async (req, res) => {
  try {
    const gatherId = req.params.gatherId;
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

    return res.json({ message: `Success!`, userName: user.username });
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

    return res.json({ message: `Success!`, userName: user.username });
  } catch (error) {
    console.log(error.message);
  }
});

export { router as gatherRouter };
