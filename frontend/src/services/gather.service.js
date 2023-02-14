import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:3001/api/admin/gather";

const create = async (map, maxPlayers) => {
  try {
    const response = await axios(`${baseUrl}/create`, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
      data: {
        map: map,
        maxPlayers: maxPlayers,
      },
    });
    console.log(response)
  } catch (error) {
    console.log(error);
  }
};

const startGather = async (id, teamA, teamB) => {
  return axios.post(baseUrl + `/startGather/${id}`, { teamA, teamB });
};

const editMaxPlayers = async (maxPlayers, gatherId) => {
  //gatherId
  try {
    const response = await axios(`${baseUrl}/updateMaxPlayers/${gatherId}`, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
      data: {
        maxPlayers: maxPlayers,
      },
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
const editMap = async (map, gatherId) => {
  //gatherId
  try {
    const response = await axios(`${baseUrl}/updateMap/${gatherId}`, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
      data: {
        map: map,
      },
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
const handleStatus = async (status, gatherId) => {
  //gatherId
  try {
    const response = await axios(`${baseUrl}/updateStatus/${gatherId}`, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
      data: {
        status: status,
      },
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

export { startGather, create, editMap, editMaxPlayers, handleStatus };

const gatherService = {
  startGather,
  handleStatus,
  create,
  editMap,
  editMaxPlayers,
};
export default gatherService;
