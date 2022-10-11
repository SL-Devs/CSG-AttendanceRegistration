import { createContext, useState } from "react";

export const LoginContext = createContext({});

const LoginContextProvider = (props) => {
  const [windowLoad, setWindowLoad] = useState(false);
  return (
    <LoginContext.Provider
      value={{
        windowLoad,
        setWindowLoad,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
