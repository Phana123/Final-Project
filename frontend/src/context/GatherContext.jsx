import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001", {
  withCredentials: true,
});
//create the context:
const GatherContext = createContext({});

const GatherContextProvider = ({ children }) => {
  const [gatherList, setGatherList] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = `http://localhost:3001/api/gather`;

  const getAllGathers = async () => {
    axios
      .get(url)
      .then((response) => {
        setGatherList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  console.log(gatherList);
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
    <>
      <GatherContext.Provider value={{ gatherList, loading }}>
        {children}
      </GatherContext.Provider>
    </>
  );
};

export { GatherContext, GatherContextProvider };
