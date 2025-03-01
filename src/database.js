const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();


const connection = mysql.createConnection({
    host:process.env.host,
    database:process.env.database,
    user:process.env.user,
    password:process.env.password,
})

//funcion async porque va esperar la conexion
const getConnection = async ()=> await connection;

module.exports ={
    getConnection
}