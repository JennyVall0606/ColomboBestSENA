const express = require('express');
const axios = require('axios');
const moment = require('moment'); // Para formatear fechas
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip', {
            params: {
                fromEntityId: 'BOG',
                toEntityId: 'MDE',
                departDate: '2025-04-01',
                returnDate: '2025-04-10',
                cabinClass: 'economy',
                adults: '1',
                currency: 'USD'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        });

        console.log('Respuesta completa de la API:', JSON.stringify(response.data, null, 2));

        res.json(response.data); // Enviar respuesta sin modificar para ver qué está regresando la API
    } catch (error) {
        console.error('Error obteniendo vuelos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error obteniendo vuelos' });
    }
});

module.exports = router;
