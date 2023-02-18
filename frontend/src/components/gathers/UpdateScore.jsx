import { Formik, Form } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import gatherService from "../../services/gather.service";
import { LocalStorageContext } from "../../context/LocalStorageContext";
import isAdmin from "../../functions/isAdmin.model";

const ScoreUpdate = ({ maxPlayers, handleInputs, item, players, gatherId }) => {
  const [killsInput, setKillsInput] = useState(0);
  const [deathInput, setDeathInput] = useState(0);
  const [assistInput, setAssistInput] = useState(0);
  const [playersData, setPlayerData] = useState({});
  const [maxPlayersState, setMaxPlayersState] = useState(
    (state) => (state += maxPlayers)
  );
  const [show, setShow] = useState(true);
  let finishPlayersArray = [];

  const formInitialValues = [0];
  const {
    adminOptionState,
    plusSavedUserCount,
    savedUserCount,
    clearSavedCountLocalStorage,
    saveUserInObjectFunc,
  } = useContext(LocalStorageContext);

  useEffect(() => {
    setPlayerData({
      userId: item.userId,
      kill: killsInput,
      death: deathInput,
      assist: assistInput,
    });
  }, [killsInput, assistInput, deathInput]);

  // <<-------------- Handle Kills Input Here ---------------->>
  function handleKillsInputChange(event) {
    const inputValue = Number(event.target.value);
    setKillsInput(inputValue);
    let obj = { killInput: inputValue };
    handleInputs(obj);
  }

  // <<-------------- Handle Death Input Here ---------------->>
  function handleDeathInputChange(event) {
    const inputValue = Number(event.target.value);
    setDeathInput(inputValue);
    let obj = { killInput: inputValue };
    handleInputs(obj);
  }

  // <<-------------- Handle Assist Input Here ---------------->>
  function handleAssistInputChange(event) {
    const inputValue = Number(event.target.value);
    setAssistInput(inputValue);
    let obj = { killInput: inputValue };
    handleInputs(obj);
  }

  // <<-------------- Handle Submit Axios Button Here ---------------->>
  const handleScoreUpdateButton = async () => {
    gatherService.scoreUpdate(gatherId, playersData);
    setShow((state) => !state);
    plusSavedUserCount(maxPlayers);
    saveUserInObjectFunc(item.userId);
  };
  console.log(finishPlayersArray);

  return (
    <>
      {show === true && adminOptionState === true && (
        <>
          <div className="update_score_form col">
            <Formik
              initialValues={formInitialValues[0]}
              onSubmit={handleScoreUpdateButton}
            >
              <Form>
                <label className="text-white ">
                  You can update it only one time!
                </label>
                <input
                  className="w-50"
                  onChange={handleKillsInputChange}
                  type="number"
                  required
                  placeholder="Kill's"
                />
                <input
                  className="w-50"
                  onChange={handleDeathInputChange}
                  type="number"
                  required
                  placeholder="Death's"
                />
                <input
                  className="w-50"
                  onChange={handleAssistInputChange}
                  type="number"
                  required
                  placeholder="Assist's"
                />
                <Button className="btn btn-warning" type="submit">
                  Send the score
                </Button>
              </Form>
            </Formik>
          </div>
        </>
      )}
    </>
  );
};

export default ScoreUpdate;
