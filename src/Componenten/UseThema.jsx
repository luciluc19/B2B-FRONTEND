import { useColorModeValue } from "@chakra-ui/react";

export const useTheme = () => {
  const bgColor = useColorModeValue("white");
  const textColor = useColorModeValue("black");
  const buttonColor = useColorModeValue("blue.500");
  const buttonHoverColor = useColorModeValue("blue.600");

  return { bgColor, textColor, buttonColor, buttonHoverColor };
};
