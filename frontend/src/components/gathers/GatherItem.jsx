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
import ScoreUpdate from "./ScoreUpdate";
import SubmitGather from "./SubmitGather";
import UploadMatchPicture from "./UploadMatchPicture";
import { useNavigate, useParams } from "react-router-dom";

const GatherItem = ({
  isUpdatedGather,
  waitingForPlayers,
  score,
  finished,
  date,
  teams,
  players,
  onGoing,
  _id,
  map,
  maxPlayers,
}) => {
  // <------------------ States Are Here ------------------------>
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(undefined);
  const [maxPlayersInput, setMaxPlayersInput] = useState(10);
  const [mapInput, setMapInput] = useState("");
  const [playersArray, setPlayersArray] = useState(players);
  const [isOnGoing, setIsOnGoing] = useState(onGoing);
  const [isFinished, setIsFinished] = useState();
  const [isUpdatedGatherState, setIsUpdatedGatherState] =
    useState(isUpdatedGather);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showSubGather, setShowSubmitGather] = useState(false);
  const [showAdminOptionsButton, setShowAdminOptionsButton] = useState(true);
  const [matchScoreInputs, setMatchScoreInputs] = useState({});
  const [adminOptionState, setAdminOptionState] = useState(false);

  const nav = useNavigate();
  // <---------------- Auth Context Imports -------------->
  const { username, isAdminState, isModerator, isManager } =
    useContext(AuthContext);

  //---------- Local Storage Context HERE->>-----
  const {
    toggleIsJoinedState,
    isJoinedState,
    savedUsersArrayLocalStorage,
    clearSavedCountLocalStorage,
  } = useContext(LocalStorageContext);

  // <----------- First Time Up Component UseEffect ------------->
  useEffect(() => {
    isJoinedFunction(toggleIsJoinedState, playersArray);
    if (isUpdatedGatherState === true) {
      setShowAdminOptionsButton(false);
    }
    isJoinedCheckFunction();
    isFinishedCheckFunction();
  }, []);
  // <-----------  UseEffect When Final isUpdateGather ------------->
  useEffect(() => {
    if (isUpdatedGather === true) {
      setIsUpdatedGatherState(true);
      localStorage.removeItem("savedUsersArray");
      localStorage.removeItem("isJoined");
    } else {
      setIsUpdatedGatherState(false);
    }
  }, [isUpdatedGather]);
  console.log(isJoinedState);
  // <----------------- UseEffect When onGoing Change ---------------->
  useEffect(() => {
    if (onGoing) {
      setIsOnGoing(true);
    } else {
      setIsOnGoing(false);
      setShowSubmitForm(true);
    }
  }, [onGoing]);
  const formInitialValues = [10, "Ascent"];
  // <<------------ When Everything is Done - Update isUpdatedGather in database ------------------>>

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
  // <-------------- isJoined Check Function with Axios!!------------------------>
  const isFinishedCheckFunction = () => {
    gatherService
      .isFinishedCheck(_id)
      .then((res) => setIsFinished(res.data.isFinished))
      .catch((e) => console.log(e));
  };
  // <-------------- isJoined Check Function with Axios!!------------------------>
  const isJoinedCheckFunction = () => {
    gatherService
      .isJoinedCheck(_id, username)
      .then((res) => res)
      .catch((e) => console.log(e));
  };
  // <----------------- toggle Show Submit Gather - Team Score Component --------------->
  const toggleShowSubmitGather = () => {
    setShowSubmitGather((state) => !state);
  };
  // <---------------- handleMatchScoresInput Function----------------------->
  const handleMatchScoresInput = (newstate) => {
    let state = matchScoreInputs;
    setMatchScoreInputs({ state, newstate });
  };

  // <<-----------------Add to queue Function is here ///----------->>
  const handleJoinButton = async () => {
    gatherService.join(_id);
    toggleIsJoinedState(true);
    isJoinedCheckFunction();
  };

  //<<------------------- Leave queue function is here //-------------->>
  const handleLeaveButton = async () => {
    gatherService.leaveQueue(_id);
    toggleIsJoinedState(false);
    isJoinedCheckFunction();
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
        setErrMessage(JSON.stringify(e.response.data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // <<--------------Button Of Hide Admin/Moderator Options HERE ---------------->>
  const handleHideAdminOptions = () => {
    setAdminOptionState((state) => !state);
  };

  // <<-------------------- Handle show Submit Gather Button -------------------->>
  const handleShowSubmitButton = () => {
    setShowSubmitForm((state) => !state);
  };

  const GeneralDivOnClick = () => {
    const { gatherId } = useParams();
    nav(`/gather/${gatherId}`);
  };
  return (
    <div>
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
        {waitingForPlayers === true && (
          <>
            Players: {players.length}/{maxPlayers}
            {players?.map((item) => (
              <>
                <span className="card bg-dark" key={item.userId}>
                  <p className="h6"> {item.userName}</p>
                  {(isAdminState || isModerator || isManager) &&
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
        {/* <span className="shadow bg-info h5 span mt-1 mb-1">*/}
        {Object.keys(teams).length !== 0 && (
          <>
            <span className="card text-black bg-success">
              <span className="date card">{date}</span>
              <p className="h4"> Team A: {score[0].teamA}</p> <br />
              {teams[0][0].TeamA.map((item) => (
                <div key={item.userId}>
                  <p className="card bg-dark h6"> {item.userName} </p>
                  {/*------------------------ Score Update IsFinished = true ?----------------- */}
                  {isFinished === true && onGoing === false ? (
                    <ScoreUpdate
                      adminOptionState={adminOptionState}
                      maxPlayers={maxPlayers}
                      handleInputs={handleMatchScoresInput}
                      gatherId={_id}
                      players={players}
                      item={item}
                    />
                  ) : (
                    "asdasdassadas"
                  )}
                </div>
              ))}
            </span>
            <span className="d-flex card mt-1 text-black bg-success">
              <p className="h4"> Team B: {score[0].teamB}</p> <br />
              {teams[0][0].TeamB.map((item) => (
                <div className="" key={item.userId}>
                  <p key={item.userId} className=" card bg-dark h6">
                    {item.userName}
                  </p>

                  {/*------------------------ Score Update IsFinished = true ?----------------- */}
                  {adminOptionState === true && isFinished === true && (
                    <ScoreUpdate
                      adminOptionState={adminOptionState}
                      maxPlayers={maxPlayers}
                      handleInputs={handleMatchScoresInput}
                      gatherId={_id}
                      players={players}
                      item={item}
                    />
                  )}
                </div>
              ))}
            </span>
            <br />
            {/* ----------Map IS here ---------- */}
            <span className=" bg-dark mt-2 card">
              <p className="h6">
                Map:
                {map}
              </p>
              {(isAdminState || isModerator || isManager) &&
                adminOptionState === true &&
                isFinished === false && (
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
                {(isAdminState || isModerator || isManager) &&
                  adminOptionState === true &&
                  isFinished === false && (
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
          </>
        )}
        {/* <<----------------- Upload Form Here ------------------->> */}
        {adminOptionState === true &&
          waitingForPlayers === false &&
          isOnGoing === true && (
            <>
              <UploadMatchPicture
                gatherId={_id}
                toggleShowSubmitGather={toggleShowSubmitGather}
                setIsFinished={setIsFinished}
              />
            </>
          )}
        {/* <<------------------- Submit gather here -------------->> */}
        {adminOptionState === true &&
          isFinished === false &&
          isOnGoing === false &&
          waitingForPlayers === false && (
            <div>
              <SubmitGather
                isFinished={isFinished}
                setShow={handleShowSubmitButton}
                show={showSubmitForm}
                submitToggle={handleShowSubmitButton}
                gatherId={_id}
              />
            </div>
          )}

        {/*<<-------------------- Status of Gather IS HERE------------>>  */}
        {isFinished === false && (
          <>
            Status:
            {waitingForPlayers ? (
              <>
                <span className="bg-success p-1" style={{ color: "white" }}>
                  Off - Waiting for players...
                </span>
              </>
            ) : (
              <>
                <span className="bg-dark" style={{ color: "green" }}>
                  On - Gather is running....
                </span>
              </>
            )}
          </>
        )}
        {/* ---------------Add And Leave Gather Buttons ARE here --------------- */}
        {waitingForPlayers === true && (
          <>
            {isJoinedState === false ||
            localStorage.getItem("isJoined") === null ? (
              <>
                <Button onClick={handleJoinButton} variant="success">
                  Join Now
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleLeaveButton} variant="danger">
                  Leave Queue
                </Button>
              </>
            )}
          </>
        )}
        {/* --------------------Delete Gather is HERE ------- ONly for admin/moderator  ----*/}
        {(isAdminState || isModerator || isManager) &&
          adminOptionState === true && (
            <Button onClick={handleDeleteGather} variant="danger">
              Delete Gather
            </Button>
          )}
        <GatherDetails />
        <ToastContainer />
      </div>
    </div>
  );
};
export default GatherItem;
