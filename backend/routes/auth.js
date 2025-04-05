require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

// 📌 Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded;
        next();
    });
};

// 📌 **1. Registro de usuario**
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Verificar si el usuario ya existe
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length > 0) {
            return res.status(400).json({ message: "El email ya está en uso" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el usuario en la base de datos
        await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 📌 **2. Iniciar sesión**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query("SELECT id, name, email, password FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Crear token JWT
        const token = jwt.sign(
            { id: user[0].id, email: user[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ 
            token,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 📌 **3. Obtener perfil del usuario autenticado**
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const [user] = await db.query("SELECT id, name, email FROM users WHERE id = ?", [req.user.id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 📌 **4. Actualizar información del usuario**
router.put("/update", verifyToken, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let updateQuery = "UPDATE users SET ";
        let values = [];
        
        if (name) {
            updateQuery += "name = ?, ";
            values.push(name);
        }
        if (email) {
            // Verificar si el nuevo email ya está en uso
            const [existingUser] = await db.query("SELECT * FROM users WHERE email = ? AND id != ?", [email, req.user.id]);
            if (existingUser.length > 0) {
                return res.status(400).json({ message: "El email ya está en uso" });
            }
            updateQuery += "email = ?, ";
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += "password = ?, ";
            values.push(hashedPassword);
        }

        if (values.length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }

        updateQuery = updateQuery.slice(0, -2); // Quitar la última coma
        updateQuery += " WHERE id = ?";
        values.push(req.user.id);

        await db.query(updateQuery, values);
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 📌 **5. Eliminar usuario**
router.delete("/delete", verifyToken, async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id = ?", [req.user.id]);
        res.json({ message: "Usuario eliminado correctamente, cierra sesión en el frontend" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;
