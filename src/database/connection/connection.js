const knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST || 'localhost',
    user : process.env.DB_USER || 'postgres',
    password : process.env.DB_PASSWORD || 'postgres',
    database : process.env.DB_DATABASE || 'pdv',
    port: process.env.DB_PORT 
  }
});

module.exports = knex;

