import knex from "knex";
const knexConfig = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations"
    }
  }
};
const db = knex(knexConfig.development);
export {
  db as d
};
