import axios from "axios";
import isAdmin from "../functions/isAdmin.model";

const baseUrl = "http://localhost:3001/api/admin";

const create = async (map: string, maxPlayers: number) => {
  // let isAdminTest: boolean = isAdmin("ROLE_ADMIN", maps);

  return axios.post(baseUrl + "/create", { map, maxPlayers });
};

const editMaxPlayers = async (maxPlayers?: number | undefined) => {
  return axios.post(baseUrl + "/updateMaxPlayers/:id", {
    maxPlayers,
  });
};
const editMap = async (map?: string) => {
  return axios.post(baseUrl + "/updateMap/:id", {
    map,
  });
};

export { create, editMap, editMaxPlayers };

const gatherService = { create, editMap, editMaxPlayers };
export default gatherService;
