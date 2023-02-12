import axios from "axios";
import isAdmin from "../functions/isAdmin.model";

const baseUrl = "http://localhost:3001/api/gather";

const create = async (map: string, maxPlayers: number) => {
  // let isAdminTest: boolean = isAdmin("ROLE_ADMIN", maps);

  return axios.post(baseUrl + "/create", { map, maxPlayers });
};

// const login = (email: string, password: string) => {
//   return axios.post(baseUrl + "/signin", { email, password }).then((res) => {
//     const token = res.data.accessToken;
//     const email = res.data.email;
//     const username = res.data.username;
//     if (token) {
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify({ email, username, token }));
//     }
//     return res.data;
//   });
// };

// const logout = () => {
//   localStorage.removeItem("token");
// };

export { create };

const gatherService = { create };
export default gatherService;
