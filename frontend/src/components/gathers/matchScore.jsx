import { Formik, Form } from "formik";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import gatherService from "./../../services/gather.service";

function playerDataReducer(state, action) {
  switch (action.type) {
    case "incrementKills":
      return state.map((player) => {
        if (player.userId === action.userId) {
          return { ...player, kills: (player.kills = action.input) };
        } else {
          return player;
        }
      });
    case "incrementDeaths":
      return state.map((player) => {
        if (player.userId === action.userId) {
          return { ...player, deaths: (player.deaths = action.input) };
        } else {
          return player;
        }
      });
    case "incrementAssists":
      return state.map((player) => {
        if (player.userId === action.userId) {
          return { ...player, assists: (player.assists = action.input) };
        } else {
          return player;
        }
      });
    case "addPlayer":
      return [...state, action.player];
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const ScoreUpdate = ({ item, players }) => {
  // const [killsInput, setKillsInput] = useState(0);
  // const [deathInput, setDeathInput] = useState(0);
  // const [assistInput, setAssistInput] = useState(0);
  // const [playerData, setPlayerData] = useState([]);

  // const updateInput = (userId) => {
  //   setPlayerData((current) => [...current, { userId: userId }]);
  // };

  // useEffect(() => {
  //   players.forEach((player) => {
  //     setPlayerData((current) => [
  //       ...current,
  //       {
  //         userId: player.userId,
  //         kills: killsInput,
  //         deaths: deathInput,
  //         assists: assistInput,
  //       },
  //     ]);
  //   });
  // }, [killsInput, deathInput, assistInput]);

  const [playerData, dispatch] = useReducer(playerDataReducer, []);

  useEffect(() => {
    players.forEach((player) => {
      dispatch({
        type: "addPlayer",
        player: { userId: player.userId, kills: 0, deaths: 0, assists: 0 },
      });
    });
  }, []);

  // Function to increment the kills for a player
  function incrementKills(userId, input) {
    dispatch({ type: "incrementKills", userId, input });
  }

  // Function to increment the deaths for a player
  function incrementDeaths(userId, input) {
    dispatch({ type: "incrementDeaths", userId, input });
  }

  // Function to increment the assists for a player
  function incrementAssists(userId, input) {
    dispatch({ type: "incrementAssists", userId, input });
  }

  console.log(playerData);
  const formInitialValues = [0];

  const handleScoreUpdateButton = (e) => {
    // e.preventDefault();
    // gatherService
    //   .scoreUpdate(item.userName, dataArray)
    //   .then(() => console.log(`work`));
  };

  return (
    <div className="col">
      <Formik
        initialValues={formInitialValues[0]}
        onSubmit={handleScoreUpdateButton}
      >
        <Form>
          <input
            onChange={(e) => incrementKills(item.userId, e.target.value)}
            type="number"
            required
            placeholder="Kill's"
          />
          <input
            onChange={(e) => incrementDeaths(item.userId, e.target.value)}
            type="number"
            required
            placeholder="Death's"
          />
          <input
            onChange={(e) => incrementAssists(item.userId, e.target.value)}
            type="number"
            required
            placeholder="Assist's"
          />
          <Button className="btn btn-warning" type="submit">
            Send the score's
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default ScoreUpdate;
