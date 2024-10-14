import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Lastpath, setLastpath] = useState('/');
  const [userID, setuserID] = useState('');

  return (
    <GlobalContext.Provider value={
      {
        isLoading, setIsLoading,
        Lastpath, setLastpath,
        userID, setuserID,


      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
