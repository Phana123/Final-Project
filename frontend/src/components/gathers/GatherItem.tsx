import { Button } from "react-bootstrap";
import {
  GatherListType,
  handleEditMapType,
  handleEditMaxPlayersType,
} from "../../@types";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ColorRing } from "react-loader-spinner";
import { AiFillDelete } from "react-icons/ai";
import gatherService from "../../services/gather.service";
import EditGatherModal from "../EditGatherModal";

const GatherItem = ({
  players,
  onGoing,
  _id,
  map,
  maxPlayers,
}: GatherListType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<string | undefined>(undefined);
  const [maxPlayersInput, setMaxPlayersInput] = useState<any>(10);
  const [mapInput, setMapInput] = useState<any>("");

  const formInitialValues: any = [10, "Ascent"];

  const { username, isAdminState, isModerator } = useContext(AuthContext);
  const [showEditGatherModalState, setShowEditGatherModalState] =
    useState<Boolean>();

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
      const url = `http://localhost:3001/api/gather/delete`;
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
      const url = `http://localhost:3001/api/admin/deletePlayerFromQueue`;
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

  return (
    <>
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
        {/* Players list Here */}
        Players:{" "}
        {players?.map((item: any) => (
          <>
            <span className="card bg-dark" key={item.userId}>
              {item.userName}
              {(isAdminState || isModerator) && (
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
          {(isModerator || isAdminState) && (
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
            {(isModerator || isAdminState) && (
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
        {/* Status of Gather IS here  */}
        Status:
        {onGoing ? (
          <>
            <span className="bg-success p-1" style={{ color: "white" }}>
              On <Button onClick={handleTurnOffGather}> Turn Off </Button>
            </span>
          </>
        ) : (
          <>
            <span className="bg-dark" style={{ color: "red" }}>
              Off
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
        {(isAdminState || isModerator) && (
          <Button onClick={handleDeleteButton} variant="danger">
            Delete Gather
          </Button>
        )}
        <Button
          onClick={() => setShowEditGatherModalState((state) => !state)}
          variant="danger"
        >
          Edit Gather
        </Button>
        <ToastContainer />
      </div>
    </>
  );
};

export default GatherItem;
