import React, { createContext, useEffect, useState } from "react";

export const LocalStorageContext = createContext({
  LShideAdminOptionsState: false,
  toggleLShideAdminOptionsState: () => {},
});

export const LocalStorageProvider = ({ children }) => {
  const [LShideAdminOptionsState, setLSHideAdminOptionsState] = useState(false);

  const hideAdminOptions = LShideAdminOptionsState === true ? "true" : "false";

  const toggleLShideAdminOptionsState = () => {
    setLSHideAdminOptionsState((state) => !state);
  };
  useEffect(() => {
    if (localStorage.getItem("hideAdminOptions") !== null) {
      return;
    } else {
      localStorage.setItem("hideAdminOptions", hideAdminOptions);
    }
  }, []);

  useEffect(() => {
    LShideAdminOptionsState === true
      ? localStorage.setItem("hideAdminOptions", "true")
      : localStorage.setItem("hideAdminOptions", "false");
  }, [LShideAdminOptionsState]);
  return (
    <LocalStorageContext.Provider
      value={{ LShideAdminOptionsState, toggleLShideAdminOptionsState }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};
