import React, { createContext, useContext, useEffect, useState } from "react";
import { LayoutRouteProps } from "react-router-dom";
import api from "../services/api";


interface AppContextInterface {
  Login: (a: string, b: string) => Promise<any> | void;
  Logout: () => void;
  user: string | null;
  signed: Boolean;
}

const AuthContext = createContext<AppContextInterface>({
  Login: () => { },
  Logout: () => { },
  user: '',
  signed: false
});

export const AuthProvider = ({ children }: LayoutRouteProps) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storagedUser = localStorage.getItem("@App:user");
    const storagedToken = localStorage.getItem("@App:token");

    if (storagedToken && storagedUser) {
      setUser(storagedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
    }
  }, []);

  async function Login(user: string, pass: string): Promise<any> {
    await api.post("/auth", {
      login: user,
      senha: pass, 
    })
      .then((response: any) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        localStorage.setItem("@App:token", response.data.token);
        localStorage.setItem("@App:user", response.data.session);
        setUser(response.data.user)
        return response;
      });
  }

  function Logout() {
    setUser(null);
    sessionStorage.removeItem("@App:user");
    sessionStorage.removeItem("App:token");
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout }
      }>
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
