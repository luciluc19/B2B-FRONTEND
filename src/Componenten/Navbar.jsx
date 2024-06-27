import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Link as ChakraLink,
  IconButton,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { Box, Stack, useBreakpointValue } from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";
import { getById, setAuthToken } from "../api/index.js";
import { useAuth } from "./contexts/Auth.contexts";
import { useNavbarStyles } from "./UseThemaNavbar.jsx";
import { NotificatieContext } from "../Componenten/contexts/Notificatie.contexts.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faShop,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { isAuthed, logOut } = useAuth();
  const { bgColor, color, hoverColor } = useNavbarStyles();
  const navigate = useNavigate();
  const { aantalOngeopend, setAantalOngeopend } =
    useContext(NotificatieContext);

  const iconSize = useBreakpointValue({
    base: "sm",
    sm: "lg",
    lg: "2x",
  });

  const handleLogout = () => {
    logOut();
    navigate(`/producten`);
  };

  useEffect(() => {
    setAuthToken(sessionStorage.getItem("jwtToken"));
    fetchData();
  }, [aantalOngeopend]);

  useEffect(() => {
    if (isAuthed) {
      fetchData();
    }
  }, [isAuthed]);

  const fetchData = async () => {
    try {
      const roles = sessionStorage.getItem("roles");
      if (roles) {
        if (roles == "klant") {
          const idKlant = sessionStorage.getItem("idKlant");
          const aantalOngeopend = await getById(
            `notificatie/ongeopend/klant/${idKlant}`
          );
          setAantalOngeopend(aantalOngeopend[0].count);
        }
        if (roles == "leverancier") {
          const idLeverancier = sessionStorage.getItem("idLeverancier");
          const aantalOngeopend = await getById(
            `notificatie/ongeopend/leverancier/${idLeverancier}`
          );
          setAantalOngeopend(aantalOngeopend[0].count);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Flex
      as="nav"
      ml="auto"
      bgColor={bgColor}
      color={color}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="nowrap"
      direction="row"
    >
      <Box>
        <ChakraLink as={RouterLink} to="/" mx={2}>
          <img
            src="https://www.the5thconference.com/wp-content/uploads/2019/08/Logo_delaware_FullColor_whitetext_digital.png"
            alt=""
            style={{ minWidth: "50px", maxWidth: "200px", height: "auto" }}
          />
        </ChakraLink>
      </Box>
      <Flex direction="row" justify="flex-end" align="center" spacing={4}>
        {isAuthed ? (
          <>
            <Tooltip label="Notificaties">
              <ChakraLink
                m={2}
                as={RouterLink}
                to="/notificaties"
                _hover={{ color: hoverColor }}
                fontSize={iconSize}
                display="flex"
                alignItems="center"
                data-cy="notificaties_btn"
              >
                <FontAwesomeIcon icon={faEnvelope} size={iconSize} />
                {aantalOngeopend > 0 && (
                  <p
                    className="notificatie-getal"
                    style={{
                      fontSize: "17px",
                      color: "red",
                      marginLeft: "0px",
                      fontWeight: "bolder",
                      marginBottom: "20px",
                    }}
                  >
                    {aantalOngeopend}
                  </p>
                )}
              </ChakraLink>
            </Tooltip>

            <Tooltip label="Bestellingen">
              <ChakraLink
                m={2}
                as={RouterLink}
                to="/bestellingen"
                _hover={{ color: hoverColor }}
                fontSize={iconSize}
                data-cy="bestellingen_btn"
              >
                <FontAwesomeIcon icon={faShop} size={iconSize} />
              </ChakraLink>
            </Tooltip>

            <Tooltip label="Producten">
              <ChakraLink
                m={2}
                as={RouterLink}
                to="/producten"
                _hover={{ color: hoverColor }}
                fontSize={iconSize}
                data-cy="productennav_btn"
              >
                <FontAwesomeIcon icon={faBox} size={iconSize} />
              </ChakraLink>
            </Tooltip>

            <Tooltip label="Profiel">
              <ChakraLink
                m={2}
                as={RouterLink}
                to="/profiel"
                _hover={{ color: hoverColor }}
                fontSize={iconSize}
                data-cy="profiel_btn"
              >
                <FontAwesomeIcon icon={faUser} size={iconSize} />
              </ChakraLink>
            </Tooltip>
            <ChakraLink
              mr={3}
              as={RouterLink}
              onClick={handleLogout}
              _hover={{ color: hoverColor }}
              fontSize={iconSize}
              whiteSpace="nowrap"
              alignSelf={""}
              data-cy="logout-btn"
            >
              Log uit
            </ChakraLink>
          </>
        ) : (
          <ChakraLink
            as={RouterLink}
            to="/login"
            ml="auto"
            mr={3}
            _hover={{ color: hoverColor }}
            fontSize={iconSize}
          >
            Login
          </ChakraLink>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
