import React, { useState } from "react";
export const NotificatieContext = React.createContext();

export const NotificatieProvider = ({ children }) => {
  const [aantalOngeopend, setAantalOngeopend] = useState(0);

  return (
    <NotificatieContext.Provider
      value={{ aantalOngeopend, setAantalOngeopend }}
    >
      {children}
    </NotificatieContext.Provider>
  );
};
