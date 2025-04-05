const express = require('express');
const axios = require('axios');
const moment = require('moment'); // Para manejar fechas
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // ✅ Fechas dinámicas
        const today = moment();
        const departDate = today.add(6, 'days').format('YYYY-MM-DD'); // Mínimo 6 días después de hoy
        const returnDate = today.add(7, 'days').format('YYYY-MM-DD'); // 1 semana después de salida

        const response = await axios.get('https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip', {
            params: {
                fromEntityId: 'BOG',
                toEntityId: 'MDE',
                departDate,
                returnDate,
                cabinClass: 'economy',
                adults: '1',
                currency: 'USD'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        });

        console.log('Respuesta de la API:', JSON.stringify(response.data, null, 2));
        res.json(response.data);
        
    } catch (error) {
        console.error('Error obteniendo vuelos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error obteniendo vuelos' });
    }
});

module.exports = router;
