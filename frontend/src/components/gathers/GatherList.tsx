import { useEffect, useState } from "react";
import axios from "axios";
import GatherItem from "./GatherItem";
import {
  CreateGatherType,
  GatherListType,
  OnGoingGatherType,
} from "../../@types";
import { Button } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import gatherService from "../../services/gather.service";
import GatherAdd from "./GatherAdd";

const GatherList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastGathers, setLstGathers] = useState<GatherListType[]>([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const url = `http://localhost:3001/api/gather`;
  const getAllGathers = async () => {
    await axios
      .get(url)
      .then((res) => {
        setLstGathers(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleCreateButton = () => {
    setIsButtonClicked((state) => !state);
  };

  useEffect(() => {
    getAllGathers();
  }, []);

  return (
    <>
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
      <h1 className="h1 card bg-dark p-1">
        Gather List <hr />
      </h1>
      <div className="row">
        <div className="col">
          {" "}
          <Button onClick={handleCreateButton} className={`p-1 mb-2`}>
            Create a gather
          </Button>
          <div className={`card ${isButtonClicked ? "" : "hide_class"}`}>
            <GatherAdd />
          </div>
        </div>
      </div>
      {lastGathers.map((item) => (
        <GatherItem {...item} key={item._id} />
      ))}
    </>
  );
};

export default GatherList;
