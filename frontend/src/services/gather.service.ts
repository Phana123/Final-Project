import axios from "axios";
import isAdmin from "../functions/isAdmin.model";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:3001/api/admin/gather";

const create = async (map: string, maxPlayers: number) => {
  // let isAdminTest: boolean = isAdmin("ROLE_ADMIN", maps);

  return axios.post(baseUrl + "/create", { map, maxPlayers });
};

const editMaxPlayers = async (
  maxPlayers?: number | undefined,
  gatherId?: string
) => {
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
const editMap = async (map?: string | undefined, gatherId?: string) => {
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
const handleStatus = async (status?: boolean | undefined, gatherId?: string) => {
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

export { create, editMap, editMaxPlayers, handleStatus };

const gatherService = { handleStatus, create, editMap, editMaxPlayers };
export default gatherService;
