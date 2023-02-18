import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:3001/api/admin/gather";
// ---------------Create Gathers Here!!! -------------->>>>
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
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

// <<--------------- When we have 10 players start Gather --------------->>
const startGather = async (id) => {
  return axios.post(`http://localhost:3001/api/gather/startGather/${id}`);
};

// <<--------------- finish Gather Here ------------------ >>
const finishGather = async (event, id, file) => {
  //http://localhost:3001/api/gather/finishGather/gatherId
  const url = `http://localhost:3001/api/admin/gather/finishGather`;
  event.preventDefault();
  const formData = new FormData();
  formData.append("image", file);
  return axios
    .post(`${url}/${id}`, formData, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((res) => console.log(`res`))
    .catch(() => console.log(`first`));
};

// <<--------------- Edit Max Players here --------------->>
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

// <<------------------ Edit Map Here ------------------->>
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
// <<---------------- handle Status Here ------------------>>>
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

// << ------------------- Add to gather is here -------------->>
const join = async (id, message) => {
  // `http://localhost:3001/api/gather/add/gatherId`;
  const url = `http://localhost:3001/api/gather/add`;

  return axios(`${url}/${id}`, {
    method: "POST",
    headers: { Authorization: localStorage.getItem("token") },
  })
    .then((res) => {
      if (!res.data.message) {
        toast.error(`User is already in queue`);
      } else {
        toast.success(`You joined to the gather`, {
          toastClassName: "custom-toast-success", // set custom CSS class name
        });
      }
    })

    .catch((e) => toast.error(`User is already in queue`));
};

// ------------------------ Leave gather here  ------------------->>
const leaveQueue = async (id) => {
  // `http://localhost:3001/api/gather/leavequeue/gatherId`;
  const url = `http://localhost:3001/api/gather/leavequeue`;

  return axios(`${url}/${id}`, {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") },
  })
    .then((res) => {
      if (!res.data.message) {
        toast.error(`User is not in queue`);
      } else {
        toast.success(`User removed from queue`, {
          toastClassName: "custom-toast-success", // set custom CSS class name
        });
      }
    })

    .catch((e) => toast.error(`User is not in queue`));
};

// << ----------------- Delete Button [Only For High Role] ------------------>>
const deleteGather = async (id) => {
  // `http://localhost:3001/api/moderator//gather/deletea/gatherId`;
  const url = `http://localhost:3001/api/moderator/gather/delete`;

  return axios(`${url}/${id}`, {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") },
  })
    .then((res) => {
      if (!res.data.message) {
        toast.error(`Gather is not exist`);
      } else {
        toast.success(`deletePlayerFromQueue`, {
          toastClassName: "custom-toast-success", // set custom CSS class name
        });
      }
    })

    .catch((e) => toast.error(`User is not in queue`));
};

// << -------------------- Remove player from queue here ----------->>
const removePlayerFromQueue = async (id, userId) => {
  // `http://localhost:3001/api/moderator//gather/deletea/gatherId`;
  const url = `http://localhost:3001/api/admin/gather/deletePlayerFromQueue`;

  return axios(`${url}/${id}/${userId}`, {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") },
  })
    .then((res) => {
      if (!res.data.message) {
        toast.error(`User is not in queue`);
      } else {
        toast.success(`Player removed successfully`, {
          toastClassName: "custom-toast-success", // set custom CSS class name
        });
      }
    })

    .catch((e) => toast.error(`User is not in queue`));
};

// <<---------------------- Score push here ----------------->>
const scoreUpdate = async (gatherId, data) => {
  //gatherId

  const url = `http://localhost:3001/api/admin/gather/insertScore/${gatherId}`;
  return await axios(url, {
    method: "POST",
    headers: { Authorization: localStorage.getItem("token") },
    data: data,
  });
};

// <<---------------------- End gather here ----------------->>
const endGather = async (gatherId, data) => {
  //gatherId

  const url = `http://localhost:3001/api/admin/gather/submitGather/${gatherId}`;
  return await axios(url, {
    method: "POST",
    headers: { Authorization: localStorage.getItem("token") },
    data: data,
  });
};
// <<---------------------- When Everything is Done - Update isUpdatedGather in database ----------------->>
const finallyFinishUpdatedGather = async (gatherId) => {
  //gatherId

  const url = `http://localhost:3001/api/admin/gather/finalUpdate/${gatherId}`;
  return await axios(url, {
    method: "POST",
    headers: { Authorization: localStorage.getItem("token") },
  });
};

export {
  startGather,
  create,
  editMap,
  editMaxPlayers,
  handleStatus,
  finishGather,
  join,
  leaveQueue,
  deleteGather,
  removePlayerFromQueue,
  scoreUpdate,
  endGather,
  finallyFinishUpdatedGather,
};

const gatherService = {
  startGather,
  handleStatus,
  create,
  editMap,
  editMaxPlayers,
  finishGather,
  join,
  leaveQueue,
  deleteGather,
  removePlayerFromQueue,
  scoreUpdate,
  endGather,
  finallyFinishUpdatedGather,
};
export default gatherService;
