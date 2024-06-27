import { Box } from "@chakra-ui/react";
import React from "react";

const CustomBox = ({ children, selected, bgColor, onClick }) => (
  <Box
    p={4}
    borderWidth="1px"
    borderRadius="md"
    boxShadow="md"
    bgColor={bgColor}
    width="100%"
    margin="5px 10px 10px 10px"
  >
    {children}
  </Box>
);

export default CustomBox;
