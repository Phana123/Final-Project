export const isJoinedFunction = async (setState, players) => {
  try {
    const userLocalStorage = localStorage.getItem("user");
    const parsedUserLocalStorage = JSON.parse(userLocalStorage);

    for (let player of players) {
      if (player.userName === parsedUserLocalStorage.username) {
        setState(true);
      } else {
        setState(false);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
