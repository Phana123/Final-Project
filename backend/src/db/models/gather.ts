import { model } from "mongoose";
import { gatherSchema } from "../schemas/gather.js";
const Gather = model("Gather", gatherSchema);

export { Gather };
