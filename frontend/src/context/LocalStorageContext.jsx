import { createContext, useEffect, useState } from "react";

//create the context:
const LocalStorageContext = createContext({
  adminOptionState: true,
  toggleAdminOptionState: () => {},
});

const LocalStorageProvider = ({ children }) => {
  //state: shared with all the app:
  const [adminOptionState, setAdminOptionState] = useState(false);
  const adminOptionStateLocalStorage = localStorage.getItem("hideAdminOptions");
  //action: changes the state:
  const toggleAdminOptionState = () => {
    if (adminOptionStateLocalStorage === "true") {
      localStorage.setItem("hideAdminOptions", "false");
      setAdminOptionState(false);
    } else {
      localStorage.setItem("hideAdminOptions", "true");
      setAdminOptionState(true);
    }
  };

  useEffect(() => {
    if (adminOptionStateLocalStorage === "true") {
      setAdminOptionState(true);
    } else {
      setAdminOptionState(false);
    }
  }, []);
  return (
    <>
      <LocalStorageContext.Provider
        value={{ adminOptionState, toggleAdminOptionState }}
      >
        {children}
      </LocalStorageContext.Provider>
    </>
  );
};

export { LocalStorageContext, LocalStorageProvider };
