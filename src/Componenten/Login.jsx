import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Heading,
  Alert,
  AlertIcon,
  Center,
  FormControl,
  FormLabel,
  Input,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "./contexts/Auth.contexts";

let fotos = [
  "https://images.unsplash.com/photo-1634302200791-9c062778b653?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.pexels.com/photos/17082478/pexels-photo-17082478/free-photo-of-red-office-building-corner.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1642220/pexels-photo-1642220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
let randomGetal = Math.floor(Math.random() * fotos.length);

export default function Login() {
  const { loading, login } = useAuth();
  const navigate = useNavigate();
  const [errorTekst, setErrorTekst] = useState();
  const [gebruikersnaam, setGebruikersnaam] = useState("");
  const [password, setPassword] = useState("");
  const [bgImage, setBgImage] = useState(fotos[randomGetal]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await login(gebruikersnaam, password);
      if (response) {
        navigate({
          pathname: "/",
          replace: true,
        });
      } else {
        setErrorTekst("Foute inlogggegevens");
      }
    } catch (error) {
      setErrorTekst("Foute inlogggegevens");
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
        <Heading mb={6}>Log in</Heading>
        {errorTekst && (
          <Alert
            status="error"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <AlertIcon />
            {errorTekst}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <FormControl id="gebruikersnaam" mb={4}>
            <FormLabel>Gebruikersnaam</FormLabel>
            <Input
              type="text"
              name="gebruikersnaam"
              data-cy="gebruikersnaam_input"
              onChange={(e) => setGebruikersnaam(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Wachtwoord</FormLabel>
            <Input
              type="password"
              name="password"
              data-cy="password_input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Flex direction={"row"}>
            <Button
              type="submit"
              isLoading={loading}
              data-cy="submit_btn"
              colorScheme="blue"
              mr={"auto"}
            >
              Log in
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              data-cy="forgot_btn"
              textColor={"blue"}
              onClick={() => navigate("/wachtwoord-vergeten")}
              ml={"auto"}
            >
              Vergeten
            </Button>
          </Flex>
        </form>
      </Container>
    </Center>
  );
}
