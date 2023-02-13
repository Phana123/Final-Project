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
