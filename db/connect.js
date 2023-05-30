const {Client} = require("pg")
require("dotenv").config()


const dbContext = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

    module.exports=dbContext