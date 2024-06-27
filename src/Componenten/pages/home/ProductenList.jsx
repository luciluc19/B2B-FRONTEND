import {
  Text,
  VStack,
  Wrap,
  WrapItem,
  Button,
  Input,
  Checkbox,
  HStack,
  Box,
  Flex,
  Select,
  FormLabel,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import React, { useState, useEffect } from "react";
import { getAll, post } from "../../../api/index.js";
import { useTheme } from "../../UseThema.jsx";
import CustomBox from "../../ChakraBox.jsx";
import { useNavigate } from "react-router-dom";

function ProductenList() {
  const { boxbgColor, bgColor, textColor, buttonColor, buttonHoverColor } =
    useTheme();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showList, setShowList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [beginPagina, setBegin] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [body, setBody] = useState([]);
  const [actualSearchTerm, setActualSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [sortedItems, setSortedItems] = useState([]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
  };

  const updateBeginPagina = (newValue) => {
    setBegin(newValue);
  };

  useEffect(() => {
    if (Array.isArray(items)) {
      setSortedItems(
        items.slice().sort((a, b) => {
          const aIsSelected = selectedCategories.includes(a.categorie);
          const bIsSelected = selectedCategories.includes(b.categorie);

          if (aIsSelected && !bIsSelected) {
            return -1;
          } else if (!aIsSelected && bIsSelected) {
            return 1;
          } else {
            return 0;
          }
        })
      );
    }
  }, [items, selectedCategories]);

  useEffect(() => {
    if (actualSearchTerm) {
      fetchNextPageDataWithSearchTerm();
    } else {
      fetchData();
    }
  }, [beginPagina, itemsPerPage, actualSearchTerm]);

  const fetchNextPageDataWithSearchTerm = async () => {
    try {
      let response;
      if (sessionStorage.getItem("roles") === "leverancier") {
        response = await getAll(
          `producten/leverancier/zoekterm/${
            beginPagina + 1
          }/${itemsPerPage}/${actualSearchTerm}`
        );
      } else {
        response = await getAll(
          `producten/zoekterm/${
            beginPagina + 1
          }/${itemsPerPage}/${actualSearchTerm}`
        );
      }
      setItems(response);
      setTotalOrders(response.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      setBody(body);
      let items;
      let categories;
      if (sessionStorage.getItem("roles") === "leverancier") {
        items = await getAll(
          `producten/leverancier/${beginPagina + 1}/${itemsPerPage}`
        );
        categories = await getAll("producten/leverancier/categories");
      } else {
        items = await getAll(
          `producten/begin/${beginPagina + 1}/${itemsPerPage}`
        );
        categories = await getAll("producten/categories");
      }
      setItems(items);
      setCategories(categories);
      setTotalOrders(items.length);

      fetchDataAndUpdateState();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = async () => {
    const finalSearchTerm = searchTerm || "";

    setActualSearchTerm(finalSearchTerm);

    try {
      let response;
      if (sessionStorage.getItem("roles") === "leverancier") {
        response = await getAll(
          `producten/leverancier/zoekterm/${
            beginPagina + 1
          }/${itemsPerPage}/${finalSearchTerm}`
        );
      } else {
        response = await getAll(
          `producten/zoekterm/${
            beginPagina + 1
          }/${itemsPerPage}/${finalSearchTerm}`
        );
      }
      setItems(response);
      setTotalOrders(response.length);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const fetchDataAndUpdateState = async () => {
    try {
      let response;

      if (selectedCategories.length > 0) {
        if (sessionStorage.getItem("roles") === "leverancier") {
          response = await getAll(
            `producten/leverancier/zoekcategorie/${beginPagina}/${itemsPerPage}/${selectedCategories}`
          );
        } else {
          response = await getAll(
            `producten/zoekcategorie/${
              beginPagina + 1
            }/${itemsPerPage}/${selectedCategories}`
          );
        }
      } else if (actualSearchTerm) {
        response = await getAll(
          `producten/zoekterm/${
            beginPagina + 1
          }/${itemsPerPage}/${actualSearchTerm}`
        );
      } else {
        if (sessionStorage.getItem("roles") === "leverancier") {
          response = await getAll(
            `producten/leverancier/${beginPagina + 1}/${itemsPerPage}`
          );
        } else {
          response = await getAll(
            `producten/begin/${beginPagina + 1}/${itemsPerPage}`
          );
        }
      }

      const sortedResponse = response.slice().sort((a, b) => {
        const aIsSelected = selectedCategories.includes(a.categorie);
        const bIsSelected = selectedCategories.includes(b.categorie);

        if (aIsSelected && !bIsSelected) {
          return -1;
        } else if (!aIsSelected && bIsSelected) {
          return 1;
        } else {
          return 0;
        }
      });

      setItems(response);
      setTotalOrders(response.length);

      setSortedItems(sortedResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const incrementBegin = async () => {
    let newBegin = beginPagina + itemsPerPage;
    updateBeginPagina(newBegin);
    window.scrollTo(0, 20);
    fetchDataAndUpdateState();
  };

  const decrementBegin = async () => {
    let newBegin = beginPagina - itemsPerPage;
    updateBeginPagina(newBegin);
    window.scrollTo(0, 0);
    fetchDataAndUpdateState();
  };

  const handleCategoryChange = async (event) => {
    const category = event.target.name;
    let updatedCategories;
    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      updatedCategories = [...selectedCategories, category];
    }
    setSelectedCategories(updatedCategories);

    try {
      let response;
      if (updatedCategories.length === 0) {
        if (sessionStorage.getItem("roles") === "leverancier") {
          response = await getAll(
            `producten/leverancier/${beginPagina + 1}/${itemsPerPage}`
          );
        } else {
          response = await getAll(
            `producten/begin/${beginPagina + 1}/${itemsPerPage}`
          );
        }
      } else {
        if (sessionStorage.getItem("roles") === "leverancier") {
          response = await getAll(
            `producten/leverancier/zoekcategorie/${
              beginPagina + 1
            }/${itemsPerPage}/${updatedCategories}`
          );
        } else {
          response = await getAll(
            `producten/zoekcategorie/${
              beginPagina + 1
            }/${itemsPerPage}/${updatedCategories}`
          );
        }
      }
      setItems(response);
      setTotalOrders(response.length);
    } catch (error) {
      console.error("Error during category search:", error);
    }
  };

  const handleClick = (selectedProductId) => {
    sessionStorage.setItem("idProduct", selectedProductId);
    navigate(`/productinfo`);
  };

  const navigate = useNavigate();

  return (
    <VStack
      spacing={5}
      minHeight={"200%"}
      align={"center"}
      justify={"center"}
      marginX={20}
    >
      {" "}
      <Text fontSize="xl" fontWeight="bold" paddingTop="15" color={textColor}>
        {sessionStorage.getItem("roles") === "leverancier"
          ? "Mijn Producten"
          : "Producten"}
      </Text>
      {showList && (
        <>
          <Flex>
            <Input
              placeholder="Zoek producten op naam"
              value={searchTerm}
              height={35}
              onChange={(e) => setSearchTerm(e.target.value)}
              mr={4}
            />
            <Button onClick={handleSearch}>Zoek</Button>
          </Flex>

          <HStack spacing={5}>
            <Wrap spacing={5} flex="1">
              {categories.map((category) => (
                <Checkbox
                  key={category}
                  name={category}
                  onChange={handleCategoryChange}
                >
                  {category}
                </Checkbox>
              ))}
            </Wrap>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              width="100px"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </Select>
          </HStack>
          <Wrap spacing={4} justify="center" overflow="none">
            {sortedItems.map((item) => (
              <WrapItem key={item.idProduct}>
                <CustomBox
                  bgColor={boxbgColor}
                  width="300px"
                  height="400px"
                  overflow="hidden"
                >
                  <img
                    src={item.foto}
                    alt="Description of the image"
                    style={{
                      width: "250px",
                      height: "250px",
                      objectFit: "contain",
                    }}
                  />
                  <Text
                    fontSize={30}
                    color={textColor}
                    textAlign={"center"}
                    maxWidth={250}
                    height={100}
                  >
                    {item.naam}
                  </Text>
                  <Text color={textColor} ml={3}>
                    prijs: € {item.eenheidsprijs.toFixed(2)}
                  </Text>
                  <Button
                    onClick={() => handleClick(item.idProduct)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                    mt={5}
                    data-cy="bestellen_btn"
                  >
                    {sessionStorage.getItem("roles") === "leverancier"
                      ? "Beheren"
                      : "Bestellen"}
                  </Button>
                </CustomBox>
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}
      <Flex alignSelf={"end"} mb={8} w="100%" justify={"space-evenly"}>
        {" "}
        {beginPagina > 0 && (
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={decrementBegin}
            float="left"
            w={"150px"}
            h={50}
            bg={"gray.500"}
          />
        )}
        <Button
          rightIcon={<ArrowForwardIcon />}
          onClick={incrementBegin}
          float="right"
          isDisabled={
            sessionStorage.getItem("roles") === "leverancier"
              ? sortedItems.length < itemsPerPage
              : sortedItems.length < itemsPerPage
          }
          w={"150px"}
          h={50}
          bg={"gray.500"}
          ml={5}
        />
      </Flex>
    </VStack>
  );
}

export default ProductenList;
