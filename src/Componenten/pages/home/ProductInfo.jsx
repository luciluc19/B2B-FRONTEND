import React, { useEffect, useState } from "react";
import { Box, Text, Flex, Button, Heading, VStack } from "@chakra-ui/react";
import { getById } from "../../../api/index.js";

function ProductInfo({}) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const id = sessionStorage.getItem("idProduct");
      const productData = await getById(`producten/${id}`);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      {product && (
        <Flex direction="row" alignItems="flex-start">
          <Box ml={7} mr={7} mt={7}>
            <img
              src={product.foto}
              alt="Foto kon niet laden"
              style={{
                width: "500px",
                height: "500px",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box ml={4} mt={50}>
            <Heading ml={9} size={"3xl"}>
              {product.naam}
            </Heading>
            <Text fontSize={25} mt={5} mb={5}>
              {product.beschrijving}
            </Text>
            <VStack align="start" spacing={3}>
              <Text>Aantal: {product.aantal}</Text>
              <Text>Gewicht: {product.gewicht} KG</Text>
              <Text>btw: % {product.btwtarief}</Text>
              <Text>Eenheidsprijs: € {product.eenheidsprijs.toFixed(2)}</Text>
            </VStack>
            {sessionStorage.roles !== "leverancier" && (
              <Button width={"30%"} bg={"lightgray"} mt={5} data-cy="kopen_btn">
                Kopen
              </Button>
            )}
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default ProductInfo;
