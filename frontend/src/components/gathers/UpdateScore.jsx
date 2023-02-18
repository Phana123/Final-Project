import { Formik, Form } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import gatherService from "../../services/gather.service";
import { LocalStorageContext } from "../../context/LocalStorageContext";
import isAdmin from "../../functions/isAdmin.model";
import { toast } from "react-toastify";

const ScoreUpdate = ({ maxPlayers, handleInputs, item, players, gatherId }) => {
  const [killsInput, setKillsInput] = useState(0);
  const [deathInput, setDeathInput] = useState(0);
  const [assistInput, setAssistInput] = useState(0);
  const [playersData, setPlayerData] = useState({});
  const [showScoreForm, setShowScoreForm] = useState();
  const [maxPlayersState, setMaxPlayersState] = useState(
    (state) => (state += maxPlayers)
  );
  const [show, setShow] = useState(true);

  const formInitialValues = [0];
  const {
    adminOptionState,
    savedUsersArrayLocalStorage,
    clearSavedCountLocalStorage,
    saveUserInArrayFunc,
  } = useContext(LocalStorageContext);
  const checkIfUserAlreadyUpdated = isAdmin(
    item.userId,
    savedUsersArrayLocalStorage
  );
  useEffect(() => {
    setPlayerData({
      userId: item.userId,
      kill: killsInput,
      death: deathInput,
      assist: assistInput,
    });

    if (checkIfUserAlreadyUpdated === true) {
      setShowScoreForm(false);
    } else {
      setShowScoreForm(true);
    }
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
    try {
      if (checkIfUserAlreadyUpdated === false) {
        gatherService.scoreUpdate(gatherId, playersData);
        setShow((state) => !state);

        saveUserInArrayFunc(item.userId);
        toast.success(`User score updated!`);
      } else {
      }
    } catch (error) {
      toast.error(`This user is already updated`);
    }
  };

  return (
    <>
      {show === true && adminOptionState === true && showScoreForm === true && (
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
