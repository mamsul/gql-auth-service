const jwt = require("jsonwebtoken");
const users = require("./lib/users.json");

const EXPIRES = process.env.EXPIRES;
const SECRET_KEY = process.env.SECRET_KEY;

const resolvers = {
  Query: {
    home: () => "Auth Service",
  },
  Mutation: {
    auth: (_, { email, password }) => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        throw new Error("Invalid credentials");
      }
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: EXPIRES }
      );

      const data = {
        token,
        email: user.email,
        expired: EXPIRES,
      };

      return data;
    },
  },
};

module.exports = resolvers;
