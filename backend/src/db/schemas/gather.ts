
import { Schema } from "mongoose";

const gatherSchema = new Schema({
  map: String,
  date: String,
  maxPlayers: Number,
  onGoing: Boolean,
  players: Array,
  teams: Array,
});

export { gatherSchema };
