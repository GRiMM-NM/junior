import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [imageUri, setImageUri] = useState(null);

  return (
    <UserContext.Provider value={{ imageUri, setImageUri }}>
      {children}
    </UserContext.Provider>
  );
};
