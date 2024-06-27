import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/Auth.contexts";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Image,
} from "@chakra-ui/react";

import { getAll, post } from "../api/index.js";

export const ProfielInfo = () => {
  const { getKlant, getLeverancier } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAkkoord, setShowAkkoord] = useState(false);
  const [body, setBody] = useState({});
  const [afhandelInfo, setAfhandelInfo] = useState({});
  const roles = sessionStorage.getItem("roles");
  const [response, setResponse] = useState([]);
  useEffect(() => {
    fetchUserData();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAll(`goedkeuring${roles}/laatsteWijziging`);
      setResponse(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function fetchUserData() {
    try {
      const data = await (roles === "klant" ? getKlant() : getLeverancier());
      if (data.length > 0) {
        setUserData(roles === "klant" ? data[0].klant : data[0].leverancier);
      } else {
        console.error(
          `No data returned from ${
            roles === "klant" ? "getKlant" : "getLeverancier"
          }`
        );
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  const handleInputChange = (event) => {
    setBody({
      ...body,
      [event.target.id]: event.target.value,
    });
  };

  const handleWijzigen = () => {
    if (!isEditing) {
      setIsEditing(true);
      setShowAkkoord(true);
      let body = {};
      if (roles === "leverancier") {
        const {
          leverancierNummer,
          gebruikersnaam,
          email,
          isActief,
          roles = "leverancier",
          bedrijf: {
            iban,
            btwNummer,
            telefoonnummer,
            sector,
            adres: { straat, nummer, stad, postcode },
          },
        } = userData;
        userData.roles = JSON.parse(userData.roles);

        body = {
          leverancierNummer,
          gebruikersnaam,
          email,
          isActief: Boolean(isActief),
          roles:["leverancier"],
          iban,
          btwNummer,
          telefoonnummer,
          sector,
          straat,
          nummer,
          stad,
          postcode,
        };
      } else if (roles === "klant") {
        const {
          klantNummer,
          gebruikersnaam,
          email,
          isActief,
          roles = "klant",
          bedrijf: {
            iban,
            btwNummer,
            telefoonnummer,
            sector,
            adres: { straat, nummer, stad, postcode },
          },
        } = userData;
        userData.roles = JSON.parse(userData.roles);
      
        body = {
          klantNummer,
          gebruikersnaam,
          email,
          isActief: Boolean(isActief),
          roles:["klant"],
          iban,
          btwNummer,
          telefoonnummer,
          sector,
          straat,
          nummer,
          stad,
          postcode,
        };
      }
      setBody(body);

      return;
    }

    setIsEditing(false);
    setShowAkkoord(false);
  };
  const handleAkkoord = async () => {
    setIsEditing(false);
    try {
      const response = await post(`goedkeuring${roles}`, {arg: body });
    } catch (error) {
      console.error(error);
    }

    setShowAkkoord(false);
    window.location.reload();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const personalFields = [
    {
      label: "Gebruikersnaam",
      value: userData.gebruikersnaam,
      id: "gebruikersnaam",
    },
    { label: "Email", value: userData.email, id: "email" },
    {
      label: `${roles === "klant" ? "Klant" : "Leverancier"}nummer`,
      value:
        roles === "klant" ? userData.klantNummer : userData.leverancierNummer,
      id: "gebruikernummer",
    },
    {
      label: `${roles === "klant" ? "Klant" : "Leverancier"} sinds`,
      value: new Date(userData.bedrijf.gebruikerSinds).toLocaleDateString(
        "en-GB"
      ),
      id: "gebruikerSinds",
    },
  ];

  const companyFields = [
    { label: "Sector", value: userData.bedrijf.sector, id: "sector" },
    {
      label: "Telefoonnummer",
      value: userData.bedrijf.telefoonnummer,
      id: "telefoonnummer",
    },
    {
      label: "Straat",
      value: userData.bedrijf.adres.straat,
      id: "straat",
    },
    {
      label: "Nummer",
      value: userData.bedrijf.adres.nummer,
      id: "nummer",
    },
    {
      label: "Postcode",
      value: userData.bedrijf.adres.postcode,
      id: "postcode",
    },
    {
      label: "Stad",
      value: userData.bedrijf.adres.stad,
      id: "stad",
    },
  ];

  const financialFields = [
    { label: "IBAN", value: userData.bedrijf.iban, id: "iban" },
    { label: "BTW", value: userData.bedrijf.btwNummer, id: "btw" },
  ];

  return (
    <Flex direction="column" align="center" justify="center" py={6}>
      <Box
        borderWidth={1}
        borderRadius="lg"
        p={4}
        width="80%"
        bg="white"
        boxShadow="lg"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <Flex direction="column" align="center">
          <Image
            boxSize="150px"
            objectFit="cover"
            src={userData.bedrijf.logo}
            alt="logo bedrijf"
            mb={4}
          />
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.500">
            {userData.gebruikersnaam}
          </Text>
        </Flex>
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Persoonlijke Informatie</Tab>
            <Tab>Bedrijfs Informatie</Tab>
            <Tab>Financiële Gegevens</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {personalFields.map(({ label, value, id }) => (
                <FormControl key={id} mb={4}>
                  <FormLabel htmlFor={id} color="gray.500">
                    {label}
                  </FormLabel>
                  {isEditing ? (
                    <Input
                      defaultValue={value}
                      borderColor={"gray"}
                      id={id}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Text color="gray.700">{value}</Text>
                  )}
                </FormControl>
              ))}
            </TabPanel>
            <TabPanel>
              {companyFields.map(({ label, value, id }) => (
                <FormControl key={id} mb={4}>
                  <FormLabel htmlFor={id} color="gray.500">
                    {label}
                  </FormLabel>
                  {isEditing ? (
                    <Input
                      defaultValue={value}
                      borderColor={"gray"}
                      id={id}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Text color="gray.700">{value}</Text>
                  )}
                </FormControl>
              ))}
            </TabPanel>
            <TabPanel>
              {financialFields.map(({ label, value, id }) => (
                <FormControl key={id} mb={4}>
                  <FormLabel htmlFor={id} color="gray.500">
                    {label}
                  </FormLabel>
                  {isEditing ? (
                    <Input
                      defaultValue={value}
                      borderColor={"gray"}
                      id={id}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Text color="gray.700">{value}</Text>
                  )}
                </FormControl>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex direction="column" align="center">
          <Button
            colorScheme="blue"
            variant="solid"
            mt={4}
            onClick={handleWijzigen}
            style={{ borderRadius: "20px" }}
          >
            wijzigen
          </Button>
          {showAkkoord &&
            (response.afgehandeld === "in behandeling" ? (
              <Flex direction="column" mt={4}>
                <Text margin={"auto"}>In behandeling</Text>
                <Text margin={"auto"}>
                  {new Date(response.datumAanvraag).toLocaleDateString()}
                </Text>
              </Flex>
            ) : (
              <Button
                colorScheme="green"
                variant="solid"
                mt={4}
                onClick={handleAkkoord}
                style={{ borderRadius: "20px" }}
              >
                Akkoord
              </Button>
            ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ProfielInfo;
