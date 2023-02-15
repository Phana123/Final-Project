import Gather from "../db/models/gather";
import nodeEvents from "../nodeEvents/nodeEvents.ts";

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
console.log(`object`)
      console.log(`asdasdasdas`);
      const shuffeledArray = await shuffleArray(gather.players);
      console.log(`shuffeledArray`, shuffeledArray);
      const middleIndex = Math.ceil(shuffeledArray.length / 2);
      const teamA = await shuffeledArray.splice(0, middleIndex);
      const teamB = await shuffeledArray.splice(-middleIndex);
      const teams = [{ TeamA: teamA, TeamB: teamB }];
      console.log(teams);
      const updatedGather = await Gather.findOneAndUpdate(
        { _id: id },
        { $push: { teams: teams } }
      );
      console.log(updatedGather);
      return nodeEvents.emit("update");
    } catch (error) {
      console.log(error);
    }
  }
};
export default shouldGameStart;
