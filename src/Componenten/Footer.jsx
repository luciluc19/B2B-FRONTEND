import { Box, useTheme } from "@chakra-ui/react";
import React from "react";
import { Flex, Link as ChakraLink, Text, Image } from "@chakra-ui/react";
import Whatsapp from "./Whatsapp";
import { useFooterStyles } from "./UseThemaFooter";

const Footer = () => {
  const { bgColor, color, hoverColor } = useFooterStyles();

  return (
    <Box>
      <Whatsapp />
      <Flex
        as="footer"
        bgColor={bgColor}
        color={color}
        justifyContent="space-between"
        alignItems="center"
        pt={5}
        pb={4}
      >
        <Box
          role="contentinfo"
          mx="auto"
          maxW="7xl"
          py="4"
          px={{ base: "4", md: "8" }}
        >
          <Flex align="center" justifyContent={"center"} fontSize="sm">
            <Text>&copy; {new Date().getFullYear()}</Text>
            <Image
              src="https://www.the5thconference.com/wp-content/uploads/2019/08/Logo_delaware_FullColor_whitetext_digital.png"
              alt=""
              maxW="10%"
              ml="2"
            />
            <Text>All rights reserved.</Text>
            <ChakraLink
              href="#"
              ml="4"
              _hover={{ color: hoverColor }}
              textDecoration="underline"
            >
              Privacy Policy
            </ChakraLink>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Footer;
