// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL
  },

  staging: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  }
};
