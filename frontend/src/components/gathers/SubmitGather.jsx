import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form } from "formik";
import { Button } from "react-bootstrap";
import gatherService from "../../services/gather.service";

const SubmitGather = ({ isFinished, gatherId, submitToggle, show }) => {
  const [teamAInput, setTeamAInput] = useState(0);
  const [teamBInput, setTeamBInput] = useState(0);

  const [scoreData, setScoreData] = useState({});
  useEffect(() => {
    setScoreData({
      teamA: teamAInput,
      teamB: teamBInput,
    });
  }, [teamAInput, teamBInput]);
  const formInitialValues = [0];

  function handleTeamAInputChange(event) {
    const inputValue = Number(event.target.value);
    setTeamAInput(inputValue);
  }
  function handleTeamBInputChange(event) {
    const inputValue = Number(event.target.value);
    setTeamBInput(inputValue);
  }

  const handleScoreUpdateButton = (event) => {
    gatherService.endGather(gatherId, scoreData);
    submitToggle();
  };

  return (
    <>
      {isFinished === true ? (
        <></>
      ) : (
        <div className="col">
          <Button onClick={submitToggle}>Submit gather here</Button>
          <div className={show ? "" : "hide_class"}>
            <Formik
              initialValues={formInitialValues[0]}
              onSubmit={handleScoreUpdateButton}
            >
              <Form>
                <input
                  className="w-50"
                  onChange={handleTeamAInputChange}
                  type="number"
                  required
                  placeholder="Insert the score of -Team A- here"
                />
                <input
                  className="w-50"
                  onChange={handleTeamBInputChange}
                  type="number"
                  required
                  placeholder="Insert the score of -Team B- here"
                />
                <Button className="btn btn-warning" type="submit">
                  Send the score after it end's
                </Button>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitGather;
