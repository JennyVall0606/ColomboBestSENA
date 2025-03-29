require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded; // Guardar la información del usuario en la request
        next();
    });
};

// Ruta para iniciar sesión y generar el token
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validación simple (debes reemplazar esto con una consulta a la base de datos)
    if (username !== "admin" || password !== "123456") {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Datos del usuario para el token
    const payload = {
        username,
        role: "admin",
    };

    // Generar token con expiración de 1 hora
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// Ruta protegida de ejemplo
router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Accediste a una ruta protegida", user: req.user });
});

module.exports = router;
