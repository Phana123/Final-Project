import { Button } from "react-bootstrap";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Form, Formik } from "formik";
import { ColorRing } from "react-loader-spinner";
import { AiFillDelete } from "react-icons/ai";
import gatherService from "../../services/gather.service";
import EditGatherModal from "../EditGatherModal";
import { LocalStorageContext } from "../../context/LocalStorageContext";
import GatherDetails from "./GatherDetails";
import "../../styles/toast-container.css";
import { isJoinedFunction } from "../../functions/isJoinedFunction";
import ScoreUpdate from "./UpdateScore";
import SubmitGather from "./SubmitGather";

const GatherItem = ({
  isUpdatedGather,
  waitingForPlayers,
  finished,
  teams,
  players,
  onGoing,
  _id,
  map,
  maxPlayers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(undefined);
  const [maxPlayersInput, setMaxPlayersInput] = useState(10);
  const [mapInput, setMapInput] = useState("");

  const [playersArray, setPlayersArray] = useState(players);
  const [isOnGoing, setIsOnGoing] = useState(onGoing);
  const [isFinished, setIsFinished] = useState(finished);
  const [isUpdatedGatherState, setIsUpdatedGatherState] =
    useState(isUpdatedGather);
  const [matchScoreImageUploadFile, setMatchScoreImageUploadFile] =
    useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showSubGather, setShowSubGather] = useState(false);
  const [showAdminOptionsButton, setShowAdminOptionsButton] = useState(true);
  const [matchScoreInputs, setMatchScoreInputs] = useState({});
  const [adminOptionState, , setAdminOptionState] = useState(false);

  const { isAdminState, isModerator, isManager } = useContext(AuthContext);

  //---------- Local Storage Context HERE->>-----
  const {
    toggleIsJoinedState,
    isJoinedState,
    savedUsersArrayLocalStorage,
    clearSavedCountLocalStorage,
  } = useContext(LocalStorageContext);

  useEffect(() => {
    isJoinedFunction(toggleIsJoinedState, playersArray);
    if (isUpdatedGatherState === true) {
      setShowAdminOptionsButton(false);
    }
  }, []);
  useEffect(() => {
    setIsOnGoing((state) => !state);
  }, [onGoing]);

  const formInitialValues = [10, "Ascent"];

  const toggleAdminOptionState = () => {
    setAdminOptionState((state) => !state);
  };

  // <<------------- When Everything is Done - Update isUpdatedGather in database ----------------------->>
  if (
    savedUsersArrayLocalStorage.length >= maxPlayers &&
    isUpdatedGatherState === false
  ) {
    setIsUpdatedGatherState(true);

    gatherService
      .finallyFinishUpdatedGather(_id)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  } else if (isUpdatedGatherState === true) {
  }
  const toggleShowSubmitGather = () => {
    setShowSubGather((state) => !state);
  };

  const handleMatchScoresInput = (newstate) => {
    let state = matchScoreInputs;
    setMatchScoreInputs({ state, newstate });
  };

  const handleSubmitMatchPicture = (event) => {
    gatherService
      .finishGather(event, _id, matchScoreImageUploadFile)
      .then(() => {
        setIsFinished((state) => !state);
        toggleShowSubmitGather();
      })
      .catch((e) => console.log(e));
  };

  // <<-----------------Add to queue Function is here ///----------->>
  const handleJoinButton = async () => {
    gatherService.join(_id);
    toggleIsJoinedState(true);
  };

  //<<------------------- Leave queue function is here //-------------->>
  const handleLeaveButton = async () => {
    gatherService.leaveQueue(_id);
    toggleIsJoinedState(false);
  };

  //<<----------- Delete single gather is here // -- Only For Mod/Admin-------->>
  const handleDeleteGather = async () => {
    gatherService.deleteGather(_id);
  };

  // <<-----------Delete player from queue function // Only for Mod/Admin---------->>
  const handleDeletePlayerButton = async (userId, id) => {
    gatherService.removePlayerFromQueue(_id, userId);
  };

  // <<----------Edit Max Players function is here // only for mod/admin---------->>
  const handleEditMaxPlayersButton = async () => {
    setIsLoading(true);

    gatherService
      .editMaxPlayers(maxPlayersInput, _id)
      .then((res) => {})
      .catch((e) => {
        setErrMessage(JSON.stringify(e.response.data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // <<------------Edit map function is here // Only for Mod/Admin----------->>
  const handleEditMapButton = async () => {
    setIsLoading(true);

    gatherService
      .editMap(mapInput, _id)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        alert(e); //swal //modal
        setErrMessage(JSON.stringify(e.response.data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // <<--------------Turn Off Gather Status Function // Only for Mod/Admin-------------->>
  const handleTurnOffGather = async () => {
    setIsLoading(true);

    gatherService
      .handleStatus(false, _id)
      .then((res) => {})
      .catch((e) => {
        setErrMessage(JSON.stringify(e.response.data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  //<<-------------- Turn Off Gather Status Function // Only for Mod/Admin-------------->>
  const handleTurnOnGather = async () => {
    setIsLoading(true);

    gatherService
      .handleStatus(true, _id)
      .then((res) => {})
      .catch((e) => {
        setErrMessage(JSON.stringify(e.response.data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // <<--------------Button Of Hide Admin/Moderator Options HERE ---------------->>
  const handleHideAdminOptions = () => {
    toggleAdminOptionState();
  };

  // <<-------------------- Handle show Submit Gather Button -------------------->>
  const handleShowSubmitButton = () => {
    setShowSubmitForm((state) => !state);
  };

  return (
    <>
      <div className="btn card mb-1 bg-secondary gatherlist-item">
        {/* <<---------------Error && IsLoading Components HERE-------------->> */}
        {errMessage && <div>${errMessage}</div>}
        {isLoading && (
          <div className="mx-auto w-25">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{ margin: "0 auto" }}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        )}
        {/* <<---------------Hide / Show admin options ----------------->> */}
        {(isAdminState || isModerator || isManager) &&
          isUpdatedGatherState === false && (
            <Button onClick={handleHideAdminOptions}>
              {adminOptionState === true
                ? `Hide admin options`
                : `Show admin options`}
            </Button>
          )}

        {/* <<----------------------Players list Here------------------->> */}
        {waitingForPlayers === true && isFinished === false && (
          <>
            Players: {players.length}/{maxPlayers}
            {players?.map((item) => (
              <>
                <span className="card bg-dark" key={item.userId}>
                  <p className="h6"> {item.userName}</p>
                  {(isAdminState || isModerator) &&
                    adminOptionState === true && (
                      <span>
                        <AiFillDelete
                          size={27}
                          style={{ color: "white" }}
                          onClick={() =>
                            handleDeletePlayerButton(item.userId, _id)
                          }
                        />
                      </span>
                    )}
                </span>
              </>
            ))}
            <br />
          </>
        )}
        {/*------------------------ Teams [Team A , Team B] Are HERE --------------- >>> */}
        <span className="shadow bg-info h5 span mt-1 mb-1">
          {isFinished === false ? (
            <>Gather is started!</>
          ) : (
            <>Gather is Ended!</>
          )}
        </span>
        {Object.keys(teams).length !== 0 && (
          <>
            <span className="card text-black bg-success">
              <p className="h4"> Team A:</p> <br />
              {teams[0][0].TeamA.map((item) => (
                <>
                  <p className="card bg-dark h6"> {item.userName} </p>
                  {/*------------------------ Score Update IsFinished = true ?----------------- */}
                  {isFinished === true && onGoing === false && (
                    <ScoreUpdate
                      maxPlayers={maxPlayers}
                      handleInputs={handleMatchScoresInput}
                      gatherId={_id}
                      players={players}
                      item={item}
                    />
                  )}
                </>
              ))}
            </span>
            <span className="card mt-1 text-black bg-success">
              <p className="h4"> Team B:</p> <br />
              {teams[0][0].TeamB.map((item) => (
                <>
                  <p className="card bg-dark h6"> {item.userName}</p>

                  {/*------------------------ Score Update IsFinished = true ?----------------- */}
                  {adminOptionState === true && isFinished === true && (
                    <ScoreUpdate
                      maxPlayers={maxPlayers}
                      handleInputs={handleMatchScoresInput}
                      gatherId={_id}
                      players={players}
                      item={item}
                    />
                  )}
                </>
              ))}
            </span>
            <br />

            {/* ----------Map IS here ---------- */}
            <span className=" bg-dark">
              <p className="h6">
                Map:
                {map}
              </p>
              {(isModerator || isAdminState) && adminOptionState === true && (
                <EditGatherModal titleOpen="Edit map">
                  <Formik
                    initialValues={formInitialValues[1]}
                    onSubmit={handleEditMapButton}
                  >
                    <Form>
                      <input
                        onChange={(e) => setMapInput(e.currentTarget.value)}
                        type="text"
                        required
                        placeholder="One of real maps"
                      />
                      <Button className="btn btn-warning" type="submit">
                        Finish click here
                      </Button>
                    </Form>
                  </Formik>
                </EditGatherModal>
              )}
            </span>
            {/*------------------ Max Players IS here  -------------*/}
            <span className=" bg-dark mt-1 ">
              <p className="h6"> Max Players: {maxPlayers} </p>
              <p>
                {(isModerator || isAdminState) && adminOptionState === true && (
                  <EditGatherModal titleOpen="Edit max players">
                    <Formik
                      initialValues={formInitialValues[0]}
                      onSubmit={handleEditMaxPlayersButton}
                    >
                      <Form>
                        <input
                          onChange={(e) =>
                            setMaxPlayersInput(e.currentTarget.value)
                          }
                          type="number"
                          required
                          placeholder="2-10 players"
                        />
                        <Button className="btn btn-warning" type="submit">
                          Finish click here
                        </Button>
                      </Form>
                    </Formik>
                  </EditGatherModal>
                )}
              </p>
            </span>
            <br />
            {/* <<------------------- Submit gather here -------------->> */}
            {adminOptionState === true &&
              isFinished === false &&
              isOnGoing === false &&
              waitingForPlayers === false && (
                <div>
                  <SubmitGather
                    isFinished={isFinished}
                    show={showSubmitForm}
                    submitToggle={handleShowSubmitButton}
                    gatherId={_id}
                  />
                </div>
              )}
            {/* <<----------------- Upload Form Here ------------------->> */}
            {adminOptionState ? "213123" : "ssssss2"}
            <br />
            {adminOptionState === true &&
              isFinished === false &&
              isOnGoing === true && (
                <form
                  className="upload__form bg-dark card my_center p-3 rounded"
                  onSubmit={handleSubmitMatchPicture}
                >
                  <span className="h5  w-100 text-danger bg-light p-2 rounded">
                    Upload match score picture file
                  </span>
                  <br />
                  <input
                    className="bg-light w-100 p-1 text-secondary rounded"
                    type="file"
                    onChange={(e) =>
                      setMatchScoreImageUploadFile(e.target.files[0])
                    }
                  />
                  <button className="btn btn-light" type="submit">
                    Upload
                  </button>
                </form>
              )}
          </>
        )}
        {/*<<-------------------- Status of Gather IS HERE------------>>  */}
        {isFinished === false && (
          <>
            Status:
            {waitingForPlayers ? (
              <>
                <span className="bg-success p-1" style={{ color: "white" }}>
                  off - Waiting for players...
                  {/* {(isModerator || isAdminState) &&
                    adminOptionState === true && (
                      <Button onClick={handleTurnOffGather}> Turn off </Button>
                    )} */}
                </span>
              </>
            ) : (
              <>
                <span className="bg-dark" style={{ color: "green" }}>
                  On
                  {/* {(isModerator || isAdminState) &&
                    adminOptionState === true && (
                      <Button onClick={handleTurnOnGather}> Turn on </Button>
                    )} */}
                </span>
              </>
            )}
          </>
        )}
        {/* ---------------Add And Leave Gather Buttons ARE here --------------- */}
        {isFinished === false &&
          isOnGoing === false &&
          waitingForPlayers === true && (
            <>
              {isJoinedState === false ? (
                <>
                  <Button onClick={handleJoinButton} variant="success">
                    Join Now
                  </Button>
                </>
              ) : (
                <Button onClick={handleLeaveButton} variant="danger">
                  Leave Queue
                </Button>
              )}
            </>
          )}
        {/* --------------------Delete Gather is HERE ------- ONly for admin/moderator  ----*/}
        {(isAdminState || isModerator) && adminOptionState === true && (
          <Button onClick={handleDeleteGather} variant="danger">
            Delete Gather
          </Button>
        )}
        <GatherDetails />
        <ToastContainer />
      </div>
    </>
  );
};
export default GatherItem;
