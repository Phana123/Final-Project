import { Schema } from "mongoose";

const scoreDocumentSchema = new Schema({
  kill: Number,
  death: Number,
  assist: Number,
  points: Number
});

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  score: Object,
  /*
        user has roles:
    */
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

export { userSchema };
