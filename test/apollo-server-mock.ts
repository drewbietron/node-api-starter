import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { apolloConfig } from "../src/server/config";

const baseContext = {
  req: { headers: {} },
};

const testApolloClient = (ctxArg = baseContext) => {
  return createTestClient(
    new ApolloServer({
      ...apolloConfig,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      context: () => apolloConfig.context(ctxArg),
    })
  );
};

export default testApolloClient;
