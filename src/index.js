import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";

const client = new ApolloClient({
  uri: "https://prime-pika-61.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "FWkiAr2x2Apg6Ej4gwr9AD2x7pVBBovJMyJKFj7n7s7npPLpfztCVU06hwKVUpIu"
  },
  cache: new InMemoryCache()
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
