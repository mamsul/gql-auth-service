const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const EXPIRES = process.env.EXPIRES || 600;
const PORT = process.env.PORT || 4000;

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => res.send("Auth Service"));

  app.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    try {
      const data = await resolvers.Mutation.auth(null, {
        email,
        password,
      });

      const token = data.token;
      res.cookie("token", token, { maxAge: EXPIRES * 1000, httpOnly: true });

      res.json({ token, email, expired: EXPIRES });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}${server.graphqlPath}`);
  });
}

startApolloServer(typeDefs, resolvers);
