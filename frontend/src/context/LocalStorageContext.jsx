import { createContext, useEffect, useState } from "react";

//create the context:
const LocalStorageContext = createContext({
  isJoinedState: true,
  toggleIsJoinedState: () => {},
  saveUserInArrayFunc: () => {},
  clearSavedCountLocalStorage: () => {},
  savedUsersArrayLocalStorage: [],
});

const LocalStorageProvider = ({ children }) => {
  //state: shared with all the app:
  const [isJoinedState, setIsJoinedState] = useState(false);
  const isJoinedToGatherLocalStorage = localStorage.getItem("isJoined");
  const savedUsersArrayLocalStorage =
    JSON.parse(localStorage.getItem("savedUsersArray")) || [];
  // <<-------------------- toggle Admin Options State here ------------------>>
  const saveUserInArrayFunc = (userId) => {
    const newItem = userId;
    savedUsersArrayLocalStorage.push(newItem);
    localStorage.setItem(
      "savedUsersArray",
      JSON.stringify(savedUsersArrayLocalStorage)
    );
  };
  // <<--------------------- toggle is Joined to Gather? State here ------------------>>
  const toggleIsJoinedState = (state) => {
    setIsJoinedState(state);
    if (state === true) {
      localStorage.setItem("isJoined", "true");
    } else {
      localStorage.setItem("isJoined", "false");
    }
  };
  // <<------------------ Clear the Local Storage when Admin finish to Update ------------------>>
  const clearSavedCountLocalStorage = () => {
    localStorage.removeItem("savedUsersArray");
  };

  useEffect(() => {
    if (isJoinedToGatherLocalStorage === "true") {
      setIsJoinedState(true);
    } else {
      setIsJoinedState(false);
    }
  }, []);
  return (
    <>
      <LocalStorageContext.Provider
        value={{
          isJoinedState,
          toggleIsJoinedState,

          clearSavedCountLocalStorage,
          saveUserInArrayFunc,
          savedUsersArrayLocalStorage,
        }}
      >
        {children}
      </LocalStorageContext.Provider>
    </>
  );
};

export { LocalStorageContext, LocalStorageProvider };
