import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GatherItem from "./GatherItem";

import { Button } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import { Link, NavLink } from "react-router-dom";

import { io } from "socket.io-client";
import AuthContext from "../../context/AuthContext";
import GatherDetails from "./GatherDetails";
const socket = io("http://localhost:3001", {
  withCredentials: true,
});

const GatherList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gatherList, setGatherList] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const url = `http://localhost:3001/api/gather`;
  const getAllGathers = async () => {
    try {
      const data = await axios(url);
      setGatherList(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateButton = () => {
    setIsButtonClicked((state) => !state);
  };

  useEffect(() => {
    getAllGathers();
    socket.on("update", () => {
      getAllGathers();
    });
    return () => {
      socket.off("update");
    };
  }, []);

  return (
    <div key="container">
      {isLoading && (
        <div className="mx-auto w-25" key="div-color-ring">
          <ColorRing
            key="color-ring"
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
      <h1 className="h1 card bg-dark p-1" key="h1">
        Gather List <hr />
      </h1>
      <div className="row" key="row">
        <div className="col" key="col">
          <NavLink
            key="btn-create-gtr-link"
            style={{ textDecoration: "none", color: "whitesmoke" }}
            to="/gather/create"
          >
            <Button
              key="btn-create-gtr"
              onClick={handleCreateButton}
              className={`p-1 mb-2`}
            >
              Create a gather
            </Button>{" "}
          </NavLink>
        </div>
      </div>
      {gatherList.map((item) => (
        <>
          <Link to={`/gather/details/${item._id}`} key={item._id}>
            <GatherItem {...item} />
          </Link>
        </>
      ))}
    </div>
  );
};

export default GatherList;
