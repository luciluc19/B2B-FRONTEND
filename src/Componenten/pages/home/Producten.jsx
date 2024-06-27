import { VStack } from "@chakra-ui/react";
import React from "react";
import ProductenList from "./ProductenList.jsx";

function Producten() {
  return (
    <VStack spacing={4} align="stretch">
      <ProductenList />
    </VStack>
  );
}

export default Producten;
