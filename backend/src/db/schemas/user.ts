import { Schema } from "mongoose";

const scoreDocumentSchema = new Schema({
  Kill: Number,
  Death: Number,
  Assist: Number,
});

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  score: { scoreDocumentSchema },
  points: String,
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
