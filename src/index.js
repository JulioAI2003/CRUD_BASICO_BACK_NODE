const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const cors = require("cors")

// Configuración inicial
const app = express();
app.set("port", 4000);
app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});

// Middlewares
app.use(cors({
    origin:["http://localhost:3000"]
}));

app.use(morgan("dev"));
app.use(express.json());

app.get("/personas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const result = await connection.query("SELECT * from persona");

        // Formatear la respuesta para devolver solo los registros necesarios
        const formattedResults = result[0].map(row => ({
            id: row.id,
            nombre: row.nombre,
            edad: row.edad
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
});

// Ruta para obtener una persona específica // no se usa
app.get("/personas/:id", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const { id } = req.params;
        const result = await connection.query("SELECT * from persona where id = ?", [id]);

        if (result[0].length > 0) {
            const formattedResult = {
                id: result[0][0].id,
                nombre: result[0][0].nombre,
                edad: result[0][0].edad
            };
            res.json(formattedResult);
        } else {
            res.status(404).send("Persona no encontrada");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los datos");
    }
});

// Ruta para agregar personas
app.post("/personas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const { nombre, edad } = req.body;
        const result = await connection.query("INSERT INTO persona (nombre, edad) VALUES (?, ?)", [nombre, edad]);

        if (result[0].affectedRows > 0) {
            res.status(200).send("Persona registrada exitosamente");
        } else {
            res.status(400).send("Error al registrar la persona");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar la persona");
    }
});

app.put("/personas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        // const { id } = req.params;
        const { nombre, edad,id } = req.body;

        const result = await connection.query("UPDATE persona SET nombre = ?, edad = ? WHERE id = ?", [nombre, edad, id]);

        if (result[0].affectedRows > 0) {
            res.send("Persona actualizada exitosamente");   
        } else {
            res.status(404).send("Persona no encontrada");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar la persona");
    }
});


app.delete("/personas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const { id } = req.body;

        const result = await connection.query("DELETE FROM persona WHERE id = ?", [id]);

        if (result[0].affectedRows > 0) {
            res.send("Persona eliminada exitosamente");
        } else {
            res.status(404).send("Persona no encontrada");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la persona");
    }
});

