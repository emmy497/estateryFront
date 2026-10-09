import { createContext, useState, useEffect, type ReactNode } from "react";

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  avatar?: string | null;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (data: { token: string; user: IUser }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  //  Initialize from localStorage
  const [user, setUser] = useState<IUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  // Sync across tabs
  useEffect(() => {
    const onStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
        setToken(localStorage.getItem("token"));
      } catch {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  //  LOGIN
  const login = ({ token, user }: { token: string; user: IUser }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    setToken(token);
  };

  //  LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
