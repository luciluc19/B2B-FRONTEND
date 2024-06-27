import { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { CheckIcon } from "@chakra-ui/icons";

import {
  Box,
  Button,
  Flex,
  Heading,
  Alert,
  AlertIcon,
  VStack,
  Center,
  FormControl,
  FormLabel,
  Input,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "./contexts/Auth.contexts";
import Error from "../Componenten/Error";
import { Kbd } from "@chakra-ui/react";
import { post } from "../api/index.js";

let fotos = [
  "https://images.unsplash.com/photo-1634302200791-9c062778b653?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.pexels.com/photos/17082478/pexels-photo-17082478/free-photo-of-red-office-building-corner.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1642220/pexels-photo-1642220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
let randomGetal = Math.floor(Math.random() * fotos.length);

export default function WachtwoordResetFunctie() {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const [errorTekst, setErrorTekst] = useState();
  const [gebruikersnaam, setGebruikersnaam] = useState("");
  const [email, setEmail] = useState("");
  let [response, setResponse] = useState("");
  const [bgImage, setBgImage] = useState(fotos[randomGetal]);

  const handleReset = async () => {
    event.preventDefault();

    let body = {
      username: gebruikersnaam,
      email: email,
    };

    response = await post(`klant/reset`, { arg: body });
    setResponse(response);
    response = await post(`leverancier/reset`, { arg: body });

    if (response) {
      setErrorTekst(
        <>
          Wachtwoord gereset <br /> Controleer uw email
        </>
      );
    } else {
      setErrorTekst(
        <>
          Wachtwoord gereset <br /> Controleer uw email
        </>
      );
    }
  };

  return (
    <Center h="100vh" bgImage={`url('${bgImage}')`} bgSize="cover">
      <Container
        maxW="sm"
        p={8}
        backgroundColor="white"
        borderRadius="md"
        boxShadow="lg"
      >
        <Heading mb={6}>Wachtwoord reset</Heading>
        {errorTekst && (
          <Alert
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              backgroundColor: "mintgreen",
            }}
          >
            {errorTekst}
            <CheckIcon ml={"auto"} color={"green"} fontSize={"2xl"} />
          </Alert>
        )}
        <form onSubmit={handleReset}>
          <FormControl id="gebruikersnaam" mb={4}>
            <FormLabel>Gebruikersnaam</FormLabel>
            <Input
              type="text"
              name="gebruikersnaam"
              data-cy="gebruikersnaam_input"
              onChange={(e) => {
                setGebruikersnaam(e.target.value);
                setErrorTekst("");
              }}
              required
            />
          </FormControl>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              data-cy="email_input"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorTekst("");
              }}
              required
            />
          </FormControl>
          <Flex direction={"row"}>
            <Button
              type="submit"
              isLoading={loading}
              data-cy="reset_btn"
              colorScheme="blue"
              mr={"auto"}
              width={"8vh"}
            >
              Resetten
            </Button>
            <Button
              isLoading={loading}
              data-cy="submit_btn"
              textColor={"blue"}
              onClick={() => navigate("/login")}
              ml={"auto"}
              width={"8vh"}
            >
              Terug
            </Button>
          </Flex>
        </form>
      </Container>
    </Center>
  );
}
