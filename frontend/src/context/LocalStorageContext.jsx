import { createContext, useEffect, useState } from "react";

//create the context:
const LocalStorageContext = createContext({
  adminOptionState: true,
  toggleAdminOptionState: () => {},
  isJoinedState: true,
  toggleIsJoinedState: () => {},
  savedUserCount: true,
  savedUsersObject: true,
  saveUserInObjectFunc: () => {},
  plusSavedUserCount: () => {},
  minusSavedUserCount: () => {},
  clearSavedCountLocalStorage: () => {},
});

const LocalStorageProvider = ({ children }) => {
  //state: shared with all the app:
  const [adminOptionState, setAdminOptionState] = useState(false);
  const [isJoinedState, setIsJoinedState] = useState(false);
  const [savedUserCount, setSavedUserCount] = useState(0);
  const [savedUsersObject, setSavedUsersObject] = useState({});
  const adminOptionStateLocalStorage = localStorage.getItem("hideAdminOptions");
  const isJoinedToGatherLocalStorage = localStorage.getItem("isJoined");
  const savedUserCountLocalStorage = localStorage.getItem("savedUserCount");
  const savedUsersObjectLocalStorage = localStorage.getItem("savedUsersObject");

  // <<-------------------- toggle Admin Options State here ------------------>>
  const saveUserInObjectFunc = (id) => {
    localStorage.setItem("savedUsersObject", [id]);
  };
  // <<-------------------- toggle Admin Options State here ------------------>>
  const toggleAdminOptionState = () => {
    if (adminOptionStateLocalStorage === "true") {
      localStorage.setItem("hideAdminOptions", "false");
      setAdminOptionState(false);
    } else {
      localStorage.setItem("hideAdminOptions", "true");
      setAdminOptionState(true);
    }
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
  // <<------------------- Saved Count Plus+Minus Function's here ---------------------->>
  const plusSavedUserCount = (maxPlayers) => {
    if (savedUserCountLocalStorage < maxPlayers) {
      setSavedUserCount((state) => (state += 1));

      const newValue = Number(savedUserCountLocalStorage) + 1;
      localStorage.setItem("savedUserCount", newValue);
    } else if (savedUserCountLocalStorage === null) {
      setSavedUserCount((state) => (state += 1));

      const newValue = Number(savedUserCountLocalStorage) + 1;
      localStorage.setItem("savedUserCount", newValue);
    }
  };
  const minusSavedUserCount = () => {
    if (savedUserCountLocalStorage > 0) {
      setSavedUserCount((state) => (state -= 1));
      const newValue = Number(savedUserCountLocalStorage) - 1;
      localStorage.setItem("savedUserCount", newValue);
    }
  };
  // <<------------------ Clear the Local Storage when Admin finish to Update ------------------>>
  const clearSavedCountLocalStorage = () => {
    localStorage.removeItem("savedUserCount");
  };

  useEffect(() => {
    if (adminOptionStateLocalStorage === "true") {
      setAdminOptionState(true);
    } else {
      setAdminOptionState(false);
    }
    if (isJoinedToGatherLocalStorage === "true") {
      setIsJoinedState(true);
    } else {
      setIsJoinedState(false);
    }

    const newValueSavedCount = Number(savedUserCountLocalStorage);

    setSavedUserCount(newValueSavedCount);
  }, []);
  return (
    <>
      <LocalStorageContext.Provider
        value={{
          adminOptionState,
          toggleAdminOptionState,
          isJoinedState,
          toggleIsJoinedState,
          savedUserCount,
          plusSavedUserCount,
          minusSavedUserCount,
          clearSavedCountLocalStorage,
          saveUserInObjectFunc,
          savedUsersObject,
        }}
      >
        {children}
      </LocalStorageContext.Provider>
    </>
  );
};

export { LocalStorageContext, LocalStorageProvider };
