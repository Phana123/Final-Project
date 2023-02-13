import Joi from "joi";


const createGatherSchema = Joi.object({
  map: Joi.string().min(2).max(15).required(),
  date: Joi.string(),
  maxPlayers: Joi.number().min(2).max(10).required(),
});

const editGatherSchema = Joi.object({
  map: Joi.string().min(2).max(15).required(),
  maxPlayers: Joi.number().min(2).max(10).required(),
  status: Joi.boolean(),
  players: Joi.array(),
});


export { createGatherSchema, editGatherSchema };
