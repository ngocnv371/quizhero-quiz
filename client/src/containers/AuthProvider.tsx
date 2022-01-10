import { AuthContext } from "../hooks/useAuth";
import React from "react";
import { fakeAuthProvider } from "../auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let [user, setUser] = React.useState<any>(null);

  let signin = (email: string, password: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser({
        email: email,
        name: "Big Guy",
        imageUrl: "https://i.pravatar.cc/300"
      });
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
