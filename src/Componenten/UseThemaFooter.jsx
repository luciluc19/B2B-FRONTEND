import { useColorModeValue } from "@chakra-ui/react";

export const useFooterStyles = () => {
  const bgColor = useColorModeValue("gray.600");
  const color = useColorModeValue("white");
  const hoverColor = useColorModeValue("blue.400");

  return { bgColor, color, hoverColor };
};
