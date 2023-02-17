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
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const startGather = async (id) => {
  return axios.post(`http://localhost:3001/api/gather/startGather/${id}`);
};

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


const scoreUpdate = async (id,data) => {
  //gatherId
  try {
    const url = `http://localhost:3001/api/admin/gather/insertScore/${id}`;
    const response = await axios(url, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
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
};
export default gatherService;
