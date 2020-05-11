// Update with your config settings.

module.exports = {
  dev: {
    client: "sqlite3",
    connection: {
      filename: "./database/sqlite/dev.sqlite",
    },
    migrations: {
      directory: "./src/database/knex/migrations",
    },
    useNullAsDefault: true,
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "./database/sqlite/test.sqlite",
    },
    migrations: {
      directory: "./src/database/knex/migrations",
    },
    useNullAsDefault: true,
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "omnistack11-staging",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "omnistack11-prod",
      user: "sysdba",
      password: "masterkey",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/database/knex/migrations",
      tableName: "knex_migrations",
    },
  },
};
