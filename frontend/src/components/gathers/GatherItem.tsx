import { Button } from "react-bootstrap";
import { GatherListType } from "../../@types";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import checkIfStringOnArray from "../../functions/checkIfStringOnArray";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const GatherItem = ({ players, onGoing, _id }: GatherListType) => {
  const { username } = useContext(AuthContext);

  const url = `http://localhost:3001/api/gather/add`;
  const handleJoinButton = async () => {
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
      const url2 = `http://localhost:3001/api/gather/leavequeue`;
      const response = await axios(`${url2}/${_id}`, {
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

  return (
    <div className="btn card mb-1 bg-secondary gatherlist-item">
      Players:{" "}
      {players?.map((item: any) => (
        <>
          <div key={item.userId}>{item.userName} </div>
        </>
      ))}
      <br /> Status:
      {onGoing ? (
        <>
          <span className="bg-success p-1" style={{ color: "white" }}>
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
      <Button onClick={handleJoinButton} variant="success">
        Join Now
      </Button>
      <Button onClick={handleLeaveButton} variant="danger">
        Leave Queue
      </Button>
      <Button onClick={handleLeaveButton} variant="danger">
        Delete Gather
      </Button>
      <ToastContainer />
    </div>
  );
};

export default GatherItem;
