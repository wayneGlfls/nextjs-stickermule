import { createYoga, createSchema } from "graphql-yoga";
import {fetchCustomers} from "../../app/lib/data";

const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
  }
  type User {
    name: String,
    email: String,
    id: String
  }
`;

const resolvers = {
  Query: {
    users() {
      //return [{ name: "Nextjs" }];
      return fetchCustomers();
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: "/api/graphql",
});