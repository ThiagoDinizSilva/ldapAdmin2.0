import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storagedUser = localStorage.getItem("@App:user");
    const storagedToken = localStorage.getItem("@App:token");

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function Login(user, pass) {
    /* const response = await api
      .post("/login", {
        email: user,
        password: pass,
      })
      .then((response) => {
        if (!response.data) {
          console.log(response);
          return false;
        }
        api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
        localStorage.setItem("@App:user", JSON.stringify(response.data.user));
        localStorage.setItem("@App:token", response.data.token);
        return true;
      }); */
    const response = {
      data: {
        token: "123",
        user: "user",
      },
    };
    api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    localStorage.setItem("@App:user", JSON.stringify(response.data.user));
    localStorage.setItem("@App:token", response.data.token);
    return { status: true };
  }

  function Logout() {
    setUser(null);

    sessionStorage.removeItem("@App:user");
    sessionStorage.removeItem("App:token");
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
