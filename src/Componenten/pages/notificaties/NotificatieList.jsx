import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  Box,
  Input,
} from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import { update, setAuthToken, post, getAll } from "../../../api/index.js";
import { useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { NotificatieContext } from "../../contexts/Notificatie.contexts.jsx";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

function NotificatieList() {
  const { setAantalOngeopend } = useContext(NotificatieContext);
  const hoverColor = useColorModeValue("gray.400", "gray.700");
  const [items, setItems] = useState([]);
  const [begin, setBegin] = useState(0);
  const [body, setBody] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const handleItemsPerPage = (e) => {
    const newValue = Number(e.target.value);
    if (newValue >= 1 && newValue <= 50) {
      setItemsPerPage(newValue);
    }
  };

  useEffect(() => {
    setAuthToken(sessionStorage.getItem("jwtToken"));
    fetchData();
  }, [begin, totalOrders, itemsPerPage]);

  const handleClick = async (notificatie) => {
    try {
      const updatedNotificatie = {
        idOrder: notificatie.idOrder,
        text: notificatie.text,
        onderwerp: notificatie.onderwerp,
        geopend: true,
        afgehandeld: notificatie.geopend === 1,
        datum: notificatie.datum,
      };

      await update(
        `notificatie/${notificatie.idNotificatie}`,
        updatedNotificatie
      );

      setAantalOngeopend((prevAantal) => prevAantal - 1);

      sessionStorage.setItem("idNotificatie", notificatie.idNotificatie);
      navigate(`/notificaties/`);
    } catch (error) {
      console.error("Error updating notificatie:", error);
    }

    navigate(`/notificatie-info`);
  };

  const fetchData = async () => {
    try {
      let body = {
        begin: begin + 1,
        aantal: itemsPerPage,
      };
      setBody(body);

      const response = await getAll(
        `notificatie/${sessionStorage.getItem("roles")}/${
          begin + 1
        }/${itemsPerPage}`
      );
      setItems(response);
      setTotalOrders(response.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const incrementBegin = async () => {
    let newBegin = begin + itemsPerPage;
    setBegin(newBegin);

    let response;

    response = await getAll(
      `notificatie/${sessionStorage.getItem("roles")}/${
        begin + 1
      }/${itemsPerPage}`);

    setItems(response);
    setTotalOrders(response.length);
  };

  const decrementBegin = () => {
    setBegin((prevBegin) => prevBegin - itemsPerPage);
  };

  if (
    sessionStorage.getItem("roles") == "leverancier" ||
    sessionStorage.getItem("roles") == "klant"
  ) {
    return (
      <Box
        alignContent={"center"}
        justifyContent={"center"}
        alignSelf={"center"}
        display={"flex"}
        flexDirection={"column"}
        padding={" 15px 150px"}
      >
        <Heading textAlign="center" mt={2}>
          Notificaties
        </Heading>
        <Box display="flex" alignItems="center" mt={5}>
          <Input
            style={{ width: "60px" }}
            value={itemsPerPage}
            onChange={handleItemsPerPage}
            onClick={(e) => e.target.select()}
            textAlign={"center"}
            margin={"auto"}
          />
        </Box>

        <Table colorScheme="Gray 500" mt={10} mb={5} variant={"unstyled"}>
          <Thead>
            <Tr>
              <Th textAlign="center" width={25}>
                Datum
              </Th>
              <Th textAlign="center" width={50}>
                Onderwerp
              </Th>
              <Th>Tekst</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr
                key={item.idNotificatie}
                onClick={() => handleClick(item)}
                border="1px solid"
                borderColor="white"
                borderRadius="5px"
                backgroundColor="white"
                fontWeight={item.geopend ? "normal" : "bold"}
                _hover={{
                  bg: hoverColor,
                  transform: "scale(1.02)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                }}
                transition="all 0.2s"
              >
                <Td textAlign="center">
                  {new Date(item.datum).toLocaleDateString("en-GB")}
                </Td>
                <Td textAlign="center">{item.onderwerp}</Td>
                <Td className="fade-out">{item.text}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          {begin > 0 && (
            <Button
              alignSelf="flex-start"
              leftIcon={<ArrowBackIcon />}
              onClick={decrementBegin}
            />
          )}
          <Box flex="1" />
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={incrementBegin}
            style={{
              visibility:
                totalOrders % itemsPerPage !== 0 ? "hidden" : "visible",
            }}
            alignSelf="flex-end"
          />
        </Box>
      </Box>
    );
  }
}

export default NotificatieList;
