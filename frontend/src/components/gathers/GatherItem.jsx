import { Button } from "react-bootstrap";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ColorRing } from "react-loader-spinner";
import { AiFillDelete } from "react-icons/ai";
import gatherService from "../../services/gather.service";
import EditGatherModal from "../EditGatherModal";
import { LocalStorageContext } from "../../context/LocalStorageContext";

const GatherItem = ({ players, onGoing, _id, map, maxPlayers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(undefined);
  const [maxPlayersInput, setMaxPlayersInput] = useState(10);
  const [mapInput, setMapInput] = useState("");
  const formInitialValues = [10, "Ascent"];
  const { isAdminState, isModerator } = useContext(AuthContext);
  // Local Storage Context HERE->>
  const { LShideAdminOptionsState, toggleLShideAdminOptionsState } =
    useContext(LocalStorageContext);

  useEffect(() => {
    toggleLShideAdminOptionsState === true
      ? toggleLShideAdminOptionsState(true)
      : toggleLShideAdminOptionsState(false);
    console.log(LShideAdminOptionsState);
  }, [LShideAdminOptionsState]);

  // Add to queue Function is here ///
  const handleJoinButton = async () => {
    const url = `http://localhost:3001/api/gather/add`;
    try {
      const response = await axios(`${url}/${_id}`, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Leave queue function is here //
  const handleLeaveButton = async () => {
    try {
      const url = `http://localhost:3001/api/gather/leavequeue`;
      const response = await axios(`${url}/${_id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete single gather is here // -- Only For Mod/Admin
  const handleDeleteButton = async () => {
    try {
      const url = `http://localhost:3001/api/moderator/gather/delete`;
      const response = await axios(`${url}/${_id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete player from queue function // Only for Mod/Admin
  const handleDeletePlayerButton = async () => {
    try {
      const url = `http://localhost:3001/api/admin/gather/deletePlayerFromQueue`;
      const response = await axios(`${url}/${_id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Max Players function is here // only for mod/admin
  const handleEditMaxPlayersButton = async () => {
    setIsLoading(true);

    gatherService
      .editMaxPlayers(maxPlayersInput, _id)
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

  // Edit map function is here // Only for Mod/Admin
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

  // Turn Off Gather Status Function // Only for Mod/Admin
  const handleTurnOffGather = async () => {
    setIsLoading(true);

    gatherService
      .handleStatus(false, _id)
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
  // Turn Off Gather Status Function // Only for Mod/Admin
  const handleTurnOnGather = async () => {
    setIsLoading(true);

    gatherService
      .handleStatus(true, _id)
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

  // Button Of Hide Admin/Moderator Options HERE -->>
  const handleHideAdminOptions = () => {
    toggleLShideAdminOptionsState(state=>!state)
  };

  return (
    <>
      {" "}
      <div className="btn card mb-1 bg-secondary gatherlist-item">
        {/* Error && IsLoading Components HERE */}
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
        {/* Hide / Show admin options --> */}
        {(isAdminState || isModerator) && (
          <Button onClick={handleHideAdminOptions}>
            {LShideAdminOptionsState === true
              ? `Hide admin options`
              : `Show admin options`}
          </Button>
        )}
        {/* Players list Here */}
        Players:{" "}
        {players?.map((item) => (
          <>
            <span className="card bg-dark" key={item.userId}>
              {item.userName}
              {(isAdminState || isModerator) &&
                LShideAdminOptionsState === true && (
                  <span>
                    <AiFillDelete
                      size={27}
                      style={{ color: "white" }}
                      onClick={handleDeletePlayerButton}
                    />
                  </span>
                )}
            </span>
          </>
        ))}
        <br />
        {/* Map IS here  */}
        <span className="card bg-dark">
          Map: {map}{" "}
          {(isModerator || isAdminState) && LShideAdminOptionsState === true && (
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
          )}{" "}
        </span>
        {/* Max Players IS here  */}
        <span className="card bg-dark">
          Max Players: {maxPlayers}{" "}
          <p>
            {(isModerator || isAdminState) &&
              LShideAdminOptionsState === true && (
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
        {/* Status of Gather IS HERE-->  */}
        Status:
        {onGoing ? (
          <>
            <span className="bg-success p-1" style={{ color: "white" }}>
              On{" "}
              {(isModerator || isAdminState) &&
                LShideAdminOptionsState === true && (
                  <Button onClick={handleTurnOffGather}> Turn off </Button>
                )}
            </span>
          </>
        ) : (
          <>
            <span className="bg-dark" style={{ color: "red" }}>
              Off{" "}
              {(isModerator || isAdminState) &&
                LShideAdminOptionsState === true && (
                  <Button onClick={handleTurnOnGather}> Turn on </Button>
                )}
            </span>
          </>
        )}
        {/* Add And Leave Gather Buttons ARE here  */}
        <Button onClick={handleJoinButton} variant="success">
          Join Now
        </Button>
        <Button onClick={handleLeaveButton} variant="danger">
          Leave Queue
        </Button>
        {/* Delete Gather is HERE -- ONly for admin/moderator  */}
        {(isAdminState || isModerator) && LShideAdminOptionsState === true && (
          <Button onClick={handleDeleteButton} variant="danger">
            Delete Gather
          </Button>
        )}
        <ToastContainer className="toast__gather" />
      </div>
    </>
  );
};

export default GatherItem;
