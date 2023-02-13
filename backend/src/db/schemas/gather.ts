import { string } from "joi";
import { Schema } from "mongoose";

const gatherSchema = new Schema({
  map: String,
  date: String,
  maxPlayers: Number,
  onGoing: Boolean,
  players: Array, 
});

export { gatherSchema };
