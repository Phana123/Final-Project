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
import EditGatherModal from "./../EditGatherModal";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ColorRing } from "react-loader-spinner";
import { AiFillDelete } from "react-icons/ai";
import gatherService from "../../services/gather.service";

const GatherItem = ({
  players,
  onGoing,
  _id,
  map,
  maxPlayers,
}: GatherListType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<string | undefined>(undefined);
  const [maxPlayersInput, setMaxPlayersInput] = useState<string | undefined>(undefined);



  const [playersArray, setPlayersArray] = useState<string[] | undefined>([]);

  useEffect(() => {
    setPlayersArray(players);
  }, []);

  const { username, isAdminState, isModerator } = useContext(AuthContext);
  const [showEditGatherModalState, setShowEditGatherModalState] =
    useState<Boolean>();

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
  const handleEditMaxPlayersButton = async (
    formValues: handleEditMaxPlayersType
  ) => {
    setIsLoading(true);

    const { maxPlayers } = formValues;
    gatherService
      .edit(maxPlayersInput)
      .then((res) => {
        console.log(res.data);
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
  const handleEditMapButton = async (formValues: handleEditMapType) => {
    setIsLoading(true);

    const { map } = formValues;
    gatherService
      .edit(map)
      .then((res) => {
        console.log(res.data);
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
        <span className="card bg-dark">
          Map: {map} <p className="btn btn-success">Edit map</p>
        </span>
        <span className="card bg-dark">
          Max Players: {maxPlayers}{" "}
          <p className="btn btn-success">Edit max players</p>
        </span>
        <br />
        Status:
        {onGoing ? (
          <>
            <span className="bg-success p-1" style={{ color: "white" }}>
              On
            </span>
          </>
        ) : (
          <>
            <span className="bg-dark" style={{ color: "red" }}>
              Off
            </span>
          </>
        )}
        <p className="btn btn-success">Turn off</p>
        <Button onClick={handleJoinButton} variant="success">
          Join Now
        </Button>
        <Button onClick={handleLeaveButton} variant="danger">
          Leave Queue
        </Button>
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
        <div className={showEditGatherModalState ? "hide_class" : ""}>
          <EditGatherModal>
            <>
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
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                </div>
              )}
            </>
          </EditGatherModal>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default GatherItem;
