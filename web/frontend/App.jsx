import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./App.css";
import { useState, useMemo, useEffect } from "react";
import { PolarisProvider } from "./components";
import { AuthContext } from "./services/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const breakpoints = {
    base: "0px",
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1536px",
  };

  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();
  const theme = extendTheme({ breakpoints });
  const queryClient = new QueryClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth helper functions
  const auth = useMemo(
    () => ({
      setToken: (token) => {
        localStorage.setItem("knox-token", token);
        setIsAuthenticated(true);
      },
      getToken: () => localStorage.getItem("knox-token"),
      getShop: () => localStorage.getItem("shop"),
      setShop: (shop) => {
        localStorage.setItem("shop", shop);
      },
      removeShop: () => {
        localStorage.removeItem("shop");
      },
      removeToken: () => {
        localStorage.removeItem("knox-token");
        localStorage.removeItem("shop");
        setIsAuthenticated(false);
      },
    }),
    []
  );

  // Fetch new token
  const fetchNewToken = async () => {
    const response = await fetch("/api/knox-token");
    const data = await response.json();
    return data;
  };

  // Validate existing token
  const validateToken = async () => {
    const token = auth.getToken();
    if (!token) throw new Error("No token found");

    const response = await fetch(
      "https://g9bvvvyptqo7uxa0.agspert-ai.com/api/token_test/",
      {
        headers: {
          Authorization: token,
        },
        method: "OPTIONS",
      }
    );

    if (!response.ok) throw new Error("Invalid token");
    return response.status;
  };

  // Authentication flow
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        if (auth.getToken()) {
          const validationStatus = await validateToken();
          if (validationStatus === 200) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }

        const newTokenData = await fetchNewToken();
        if (newTokenData?.token) {
          auth.setToken("Token " + newTokenData.token);
          auth.setShop(newTokenData?.shop);
        } else {
          auth.removeToken();
          auth.removeShop();
        }
      } catch (error) {
        console.error("Authentication error:", error);
        auth.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Retry authentication handler
  const retryAuthentication = async () => {
    try {
      setIsLoading(true);
      const newTokenData = await fetchNewToken();
      if (newTokenData?.token) {
        auth.setToken("Token " + newTokenData.token);
        auth.setShop(newTokenData?.shop);
      } else {
        auth.removeToken();
        auth.removeShop();
      }
    } catch (error) {
      console.error("Retry authentication error:", error);
      auth.removeToken();
      auth.removeShop();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PolarisProvider>
      <AuthContext.Provider
        value={{
          isLoading,
          isAuthenticated,
          ...auth,
          refetchToken: retryAuthentication,
        }}
      >
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <NavMenu>
                <a href="/" rel="home" />
                <a href="/stories">{t("NavigationMenu.stories")}</a>
                <a href="/storyBuilder">{t("NavigationMenu.storyBuilder")}</a>
              </NavMenu>
              <Routes pages={pages} />
            </BrowserRouter>
          </QueryClientProvider>
        </ChakraProvider>
      </AuthContext.Provider>
    </PolarisProvider>
  );
}
