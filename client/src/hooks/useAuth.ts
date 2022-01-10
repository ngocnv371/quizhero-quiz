import React from "react";

interface AuthContextType {
  user: any;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export default function useAuth() {
  return React.useContext(AuthContext);
}
