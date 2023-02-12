import { createContext, useEffect, useState } from "react";
import { AuthContextType, ChildProps } from "../@types";
import isAdmin from "../functions/isAdmin.model";

const initialState: AuthContextType = {
  isLoggedIn: false,
  login(username, email, token) {},
  logout() {},
};

const AuthContext = createContext<AuthContextType>(initialState);

const AuthContextProvider = ({ children }: ChildProps) => {
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const token = user.token;
      const email = user.email;
      const username = user.username;
      const roles = user.roles;

      //isAdminTest = false/true
      let isAdminTest: boolean = isAdmin("ROLE_ADMIN", roles);
      if (isAdminTest) {
        setIsAdminState(true);
        console.log(`Your'e admin!`);
      }
      let isModeratorTest: boolean = isAdmin("ROLE_MODERATOR", roles);
      if (isModeratorTest) {
        setIsModerator(true);
        console.log(`Your'e moderator!`);
      }
      login(username, email, token);
    }
  }, []);
  const [isAdminState, setIsAdminState] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  const login = (username: string, email: string, token: string) => {
    setIsLoggedIn(true);
    setEmail(email);
    setUsername(username);
    setToken(token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(undefined);
    setEmail(undefined);
    setUsername(undefined);
  };
  //what we want to expose/share with the app:
  const contextValues = {
    isAdmin,
    isLoggedIn,
    username,
    token,
    email,
    login,
    logout,
    isModerator,
    isAdminState,
  };
  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

//the provider is only used in index.tsx <Provider>
export { AuthContext, AuthContextProvider };

//used in all the app:
export default AuthContext;
