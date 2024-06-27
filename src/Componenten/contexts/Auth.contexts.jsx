export const useAuth = () => useContext(AuthContext);

import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from "react";
import useSWRMutation from "swr/mutation";
import * as api from "../../api/index.js";

const JWT_TOKEN_KEY = "jwtToken";
const KLANT_ID_KEY = "idKlant";
const Roles = "roles";
const LEVERANCIER_ID_KEY = "idLeverancier";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem(JWT_TOKEN_KEY));
  const [gebruiker, setGebruiker] = useState(null);
  const [ready, setReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  

  useEffect(() => {
    api.setAuthToken(token);
    setIsAuthed(Boolean(token));
    setReady(true);
  }, [token]);

  const { trigger: doRegister } = useSWRMutation("klant/register", api.post);

  const setSession = useCallback((token, user) => {
    setToken(token);
    setGebruiker(user);

    sessionStorage.setItem(JWT_TOKEN_KEY, token);
    sessionStorage.setItem(Roles, JSON.parse(user.roles)[0]);
    if (JSON.parse(user.roles)[0] == "klant") {
      sessionStorage.setItem(KLANT_ID_KEY, user.idKlant);
    } else {
      sessionStorage.setItem(LEVERANCIER_ID_KEY, user.idLeverancier);
    }
  }, []);

  const { isMutating: loadingKlant, trigger: doLoginKlant } = useSWRMutation(
    "klant/login",
    api.post
  );

  const { isMutating: loadingLeverancier, trigger: doLoginLeverancier } =
    useSWRMutation("leverancier/login", api.post);

  const login = useCallback(
    async (username, password) => {
      try {
        const { token, user } = await doLoginKlant({
          username,
          password,
        });

        setSession(token, user);
        return true;
      } catch (error) {
        console.log("Error during login:", error);
      }

      try {
        const { token, user } = await doLoginLeverancier({
          username,
          password,
        });

        setSession(token, user);
        return true;
      } catch (error) {}
    },
    [doLoginKlant, doLoginLeverancier, setSession]
  );

  const loading = loadingKlant || loadingLeverancier;

  const logOut = useCallback(() => {
    try {
      setToken(null);
      setGebruiker(null);

      const chakraColor = sessionStorage.getItem("chakra-ui-color");
      sessionStorage.clear();
      if (chakraColor) {
        sessionStorage.setItem("chakra-ui-color", chakraColor);
      }

      sessionStorage.removeItem(JWT_TOKEN_KEY);
      if (gebruiker && gebruiker.roles == "klant") {
        sessionStorage.removeItem(KLANT_ID_KEY);
      } else {
        sessionStorage.removeItem(LEVERANCIER_ID_KEY);
      }
      sessionStorage.removeItem(Roles);

      return true;
    } catch (error) {
      console.error("Error during logOut:", error);
      return false;
    }
  }, [setToken, setGebruiker, gebruiker]);

  const getAfspraken = useCallback(async () => {
    try {
      const response = await api.get(`/api/afspraken/`);
      if (response) {
        return response.items;
      }
    } catch (error) {
      console.error("Error during ophalen van Afspraken:", error);
      return false;
    }
  }, []);

  const getKlant = useCallback(async () => {
    try {
      const response = await api.getAll(`klant/`);
      if (response) {
        return response;
      }
    } catch (error) {
      console.error("Error during ophalen van Klant:", error);
      return false;
    }
  }, []);

  const getLeverancier = useCallback(async () => {
    try {
      const response = await api.getAll(`leverancier/`);
      if (response) {
        return response;
      }
    } catch (error) {
      console.error("Error during ophalen van Leverancier:", error);
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      gebruiker,
      ready,
      loading,
      isAuthed,
      login,
      logOut,
      getAfspraken,
      getKlant,
      getLeverancier,
    }),
    [
      token,
      gebruiker,
      ready,
      loading,
      isAuthed,
      login,
      logOut,
      getAfspraken,
      getKlant,
      getLeverancier,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
