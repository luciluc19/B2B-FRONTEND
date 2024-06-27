import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Grid,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  List,
  ListItem,
  Flex,
  useBreakpointValue,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { create, getAll, getById } from "../../../api/index.js";
import { useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import styled from "@emotion/styled";

function BestellingInfoPagina() {
  const [order, setOrder] = useState(null);
  const [adres, setAdres] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const hoverColor = useColorModeValue("gray.400", "gray.700");

  const navigate = useNavigate();

  const isTableLayout = useBreakpointValue({ base: false, md: true });

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const PrintButton = styled(Button)`
    @media print {
      display: none;
    }
  `;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const idOrder = sessionStorage.getItem("idOrder");
      const order = await getById(`order/${idOrder}`);
      const adres = await getById(`adres/${order.idAdres}`);
      let orderDetails = await getById(`orderdetails/order/${idOrder}`);
      setOrder(order);
      setAdres(adres);
      setOrderDetails(orderDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = (id) => {
    sessionStorage.setItem("idProduct", id);
    navigate(`/productinfo`);
  };

  const handlePaymentReminder = async () => {
    const reminderMessage = `Beste,

    Dit is een herinnering om u eraan te herinneren dat uw betaling voor de bestelling met ordernummer: ${order.idOrder} nog niet is ontvangen. 

    Gelieve zo spoedig mogelijk de betaling te voldoen om vertragingen in de verwerking van uw bestelling te voorkomen. Als u de betaling al heeft gedaan, kunt u deze herinnering negeren.

    Bedankt voor uw aandacht en medewerking.

    Met vriendelijke groet,

    delaware`;
      const idOrder = order.idOrder;
      const text = reminderMessage;
      const onderwerp = "Betalingsherinnering ";
      const geopend = false;
      const afgehandeld = false;
      const datum = new Date();
      const response = await create("notificatie", {
        arg: {
          idOrder,
          text,
          onderwerp,
          geopend,
          afgehandeld,
          datum,
        },
      });

     
 
  };

  let roles = sessionStorage.getItem("roles");

  return (
    <div ref={componentRef} style={{ marginTop: 45 }}>
      <Box
        mt={10}
        w="80%"
        p={5}
        color="black"
        bg={"lightgray"}
        m="auto"
        boxShadow="lg"
        borderRadius="lg"
      >
        {" "}
        <Heading size="lg">Order</Heading>
        <List spacing={3} mt={2}>
          <ListItem>
            Order nummer: <b>{order && order.idOrder}</b>
          </ListItem>
          <ListItem>
            Datum:{" "}
            <b>{order && new Date(order.datum).toLocaleDateString("en-GB")}</b>
          </ListItem>
          <ListItem>
            Order Status: <b>{order && order.orderStatus}</b>
          </ListItem>
          <ListItem>
            Betaling Status:{" "}
            <b>
              {order &&
                (order.betalingStatus == 1 ? "Betaald" : "Niet Betaald")}
            </b>
            {order &&
              order.betalingStatus != 1 &&
              sessionStorage.getItem("roles") == "leverancier" && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  ml={2}
                  onClick={handlePaymentReminder}
                >
                  Betalingsherinnering
                </Button>
              )}
          </ListItem>
          <ListItem>
            Adres:{" "}
            <b>{adres && `${adres.straat} ${adres.nummer} ${adres.stad}`}</b>
          </ListItem>
        </List>
        {roles == "klant" && order && order.betalingStatus != "1" && (
          <Button colorScheme="green" mt={5} w="100%">
            betalen
          </Button>
        )}
        {roles == "leverancier" && order && order.orderStatus != "geleverd" && (
          <Button colorScheme="green" mt={5} w="100%">
            verander levering status
          </Button>
        )}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" p={5}>
        {isTableLayout ? (
          <Table variant="simple" m={8} width="100%">
            <Thead>
              <Tr>
                <Th> </Th>
                <Th>naam</Th>
                <Th>stukprijs</Th>
                <Th>btw</Th>
                <Th>aantal</Th>
                <Th width={"25px"}>prijs</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderDetails &&
                orderDetails.map((item) => (
                  <Tr
                    key={item.idOrderDetails}
                    onClick={() => handleClick(item.idOrderDetails)}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      bg: hoverColor,
                      transform: "scale(1.02)",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                      cursor: "pointer",
                    }}
                    transition="all 0.2s"
                  >
                    <Td width="20%">
                      <Image
                        src={item.foto}
                        alt="Product"
                        objectFit="contain"
                      />
                    </Td>
                    <Td width="20%">{item.naam}</Td>
                    <Td width="10%">€ {item.eenheidsprijs}</Td>
                    <Td width="10%">
                      € {(item.btwtarief / 100) * item.eenheidsprijs}
                    </Td>
                    <Td width="10%">{item.aantal}</Td>
                    <Td width={"25px"}>
                      €
                      {(
                        ((item.btwtarief / 100) * item.eenheidsprijs +
                          item.eenheidsprijs) *
                        item.aantal
                      ).toFixed(2)}
                    </Td>
                  </Tr>
                ))}
              <Tr>
                <Th gridColumn={"5 / auto"} textAlign="right">
                  Totaal:
                </Th>
                <Th>
                  <Flex alignItems="center">
                    <Box mr={2}>
                      €
                      {orderDetails &&
                        orderDetails
                          .reduce(
                            (total, item) =>
                              total +
                              ((item.btwtarief / 100) * item.eenheidsprijs +
                                item.eenheidsprijs) *
                                item.aantal,
                            0
                          )
                          .toFixed(2)}
                    </Box>
                    <Button onClick={handlePrint} colorScheme="red" size="sm">
                      PDF
                    </Button>
                  </Flex>
                </Th>
              </Tr>
            </Tbody>
          </Table>
        ) : (
          <VStack spacing={4} width="100%">
            {orderDetails &&
              orderDetails.map((item) => (
                <React.Fragment key={item.idOrderDetails}>
                  <Box
                    onClick={() => handleClick(item.idOrderDetails)}
                    borderWidth={1}
                    borderRadius="lg"
                    overflow="hidden"
                    p={4}
                    _hover={{
                      bg: hoverColor,
                      transform: "scale(1.02)",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                      cursor: "pointer",
                    }}
                    transition="all 0.2s"
                    width="100%"
                  >
                    <HStack spacing={4}>
                      <Image
                        boxSize="120px"
                        src={item.foto}
                        alt="Product"
                        objectFit="contain"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{item.naam}</Text>
                        <Text>€ {item.eenheidsprijs}</Text>
                        <Text>
                          BTW: € {(item.btwtarief / 100) * item.eenheidsprijs}
                        </Text>
                        <Text>Aantal: {item.aantal}</Text>
                        <Text>
                          Prijs: €
                          {(
                            ((item.btwtarief / 100) * item.eenheidsprijs +
                              item.eenheidsprijs) *
                            item.aantal
                          ).toFixed(2)}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </React.Fragment>
              ))}
            <Flex alignItems="center">
              <Box mr={2}>
                Totaal: €
                {orderDetails &&
                  orderDetails
                    .reduce(
                      (total, item) =>
                        total +
                        ((item.btwtarief / 100) * item.eenheidsprijs +
                          item.eenheidsprijs) *
                          item.aantal,
                      0
                    )
                    .toFixed(2)}
              </Box>
              <Button onClick={handlePrint} colorScheme="red" size="sm">
                PDF
              </Button>
            </Flex>
          </VStack>
        )}
      </Box>
    </div>
  );
}

export default BestellingInfoPagina;
