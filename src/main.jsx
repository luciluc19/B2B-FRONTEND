import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  NotFound,
  Home,
  Login,
  Bestelling,
  Profiel,
  BestellingInfo,
  ProductInfoMeer,
  Notificaties,
  NotificatieInfoMeer,
  ProductenList,
  WachtwoordReset,
} from "./pages.jsx";
import PrivateRoute from "./Componenten/PrivateRoute.jsx";
import Layout from "./Componenten/Layout.jsx";
import { AuthProvider } from "./Componenten/contexts/Auth.contexts.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { NotificatieProvider } from "./Componenten/contexts/Notificatie.contexts.jsx";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/", element: <Home /> },
      { path: "*", element: <NotFound /> },
      { path: "login", element: <Login /> },
      {
        path: "Bestellingen",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Bestelling />,
          },
        ],
      },
      {
        path: "BestellingInfo",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <BestellingInfo />,
          },
        ],
      },
      {
        path: "profiel",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Profiel />,
          },
        ],
      },
      {
        path: "producten",
        children: [
          {
            index: true,
            element: <ProductenList />,
          },
        ],
      },
      {
        path: "productinfo",

        children: [
          {
            index: true,
            element: <ProductInfoMeer />,
          },
        ],
      },
      {
        path: "notificaties",

        children: [
          {
            index: true,
            element: <Notificaties />,
          },
        ],
      },
      {
        path: "notificatie-info",

        children: [
          {
            index: true,
            element: <NotificatieInfoMeer />,
          },
        ],
      },
      {
        path: "wachtwoord-vergeten",

        children: [
          {
            index: true,
            element: <WachtwoordReset />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificatieProvider>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </NotificatieProvider>
    </AuthProvider>
  </React.StrictMode>
);
