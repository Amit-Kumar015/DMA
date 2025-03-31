import React, { useState, useMemo, createContext } from "react";
import AuthStorage from "../authStorage";

// Creating Context
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(() => ({
    signIn: async (foundUser) => {
      try {
        await AuthStorage.saveTokens(foundUser?.access, foundUser?.refresh);
        setUserToken(foundUser?.access);  // ✅ Token is updated in state
      } catch (e) {
        console.log(e);
      }
    },
    signOut: async () => {
      try {
        await AuthStorage.removeTokens();
        setUserToken(null);  // ✅ Logout clears the token
      } catch (e) {
        console.log(e);
      }
    },
    userToken,  // ✅ Provide userToken in context for easy access
  }), [userToken]);  // ✅ Added dependency to re-create context when userToken changes

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
