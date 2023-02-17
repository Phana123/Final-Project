import { createContext, useEffect, useState } from "react";

//create the context:
const LocalStorageContext = createContext({
  adminOptionState: true,
  toggleAdminOptionState: () => {},
  isJoinedState: true,
  toggleIsJoinedState: () => {},
  savedUserCount: true,
  plusSavedUserCount: () => {},
  minusSavedUserCount: () => {},
  clearSavedCountLocalStorage: () => {},
});

const LocalStorageProvider = ({ children }) => {
  //state: shared with all the app:
  const [adminOptionState, setAdminOptionState] = useState(false);
  const [isJoinedState, setIsJoinedState] = useState(false);
  const [savedUserCount, setSavedUserCount] = useState(0);
  const adminOptionStateLocalStorage = localStorage.getItem("hideAdminOptions");
  const isJoinedToGatherLocalStorage = localStorage.getItem("isJoined");
  const savedUserCountLocalStorage = localStorage.getItem("savedUserCount");

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
  console.log(savedUserCountLocalStorage);
  const plusSavedUserCount = (maxPlayers) => {
    console.log(maxPlayers);
    if (savedUserCountLocalStorage < maxPlayers) {
      setSavedUserCount((state) => (state += 1));

      const newValue = Number(savedUserCountLocalStorage) + 1;
      localStorage.setItem("savedUserCount", newValue);
    } else if (savedUserCountLocalStorage === null) {
      console.log(`work`);
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
        }}
      >
        {children}
      </LocalStorageContext.Provider>
    </>
  );
};

export { LocalStorageContext, LocalStorageProvider };
