import { Schema } from "mongoose";
 
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  /*
        user has roles:
    */
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref:"Role"
    },
  ],
});

export {userSchema}