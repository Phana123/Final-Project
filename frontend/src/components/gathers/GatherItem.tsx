import { GatherListType } from "../../@types";
const GatherItem = ({
  date,
  map,
  maxPlayers,
  onGoing,
  players,
}: GatherListType) => {
  return (
    <div className="card bg-secondary p-2 gatherlist-item">
      Date: {date} <br />| Map: {map}
      {"  "} | Players: {players} {"  "} | Status:{" "}
      {onGoing ? (
        <>
          <span className="bg-light" style={{ color: "green" }}>
            ON
          </span>
        </>
      ) : (
        <>
          <span className="bg-dark" style={{ color: "red" }}>
            OFF
          </span>
        </>
      )}
    </div>
  );
};

export default GatherItem;
