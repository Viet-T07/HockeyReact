import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";

import theme from "../theme";
import "../../src/styles/globals.scss";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
