import React, { useEffect, useState } from "react";
import { getById, update } from "../../../api/index.js";
import { useNavigate } from "react-router-dom";
import { VStack, Heading, Button, Box, Center, Text } from "@chakra-ui/react";

function NotificatieInfoPagina() {
  const [notificatie, SetNotificatie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    return () => {
      window.addEventListener("popstate", fetchData);
      window.removeEventListener("popstate", fetchData);
    };
  }, []);

  const fetchData = async () => {
    try {
      const idNotificatie = sessionStorage.getItem("idNotificatie");
      const notificatie = await getById(`notificatie/${idNotificatie}`);
      SetNotificatie(notificatie);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Center h="100vh">
      <Box
        borderRadius="5%"
        boxShadow="2xl"
        p={5}
        borderWidth="1px"
        borderColor="gray.200"
        bg="white"
      >
        <VStack spacing={5} width="100%" maxW="md">
          <Heading as="h2" size="lg">
            {notificatie && notificatie.onderwerp}
          </Heading>
          <Text fontSize="m" color="gray.400" fontStyle="italic">
            {notificatie &&
              new Date(notificatie.datum).toLocaleDateString("en-GB")}
          </Text>
          <Text fontSize="xl">{notificatie && notificatie.text}</Text>
        </VStack>
      </Box>
    </Center>
  );
}

export default NotificatieInfoPagina;
