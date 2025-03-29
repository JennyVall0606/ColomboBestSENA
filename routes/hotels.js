const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

async function searchHotels(entityId, checkin, checkout, rooms, adults, currency) {
    try {
        const response = await axios.get('https://sky-scanner3.p.rapidapi.com/hotels/search', {
            params: { entityId, checkin, checkout, rooms, adults, currency },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        });

        console.log('API Response:', JSON.stringify(response.data, null, 2));

        if (!response.data?.data?.results?.hotelCards) {
            return [];
        }

        return response.data.data.results.hotelCards.map(hotel => ({
            name: hotel.name || 'No disponible',
            price: hotel.lowestPrice?.price || 'No disponible',
            rating: hotel.reviewsSummary?.score || 'No disponible',
            address: hotel.distance || 'No disponible',
            image: hotel.images?.[0] || '',
            url: hotel.lowestPrice?.url || ''
        }));

    } catch (error) {
        console.error('Error en searchHotels:', error.response?.data || error.message);
        return [];
    }
}


router.get('/', async (req, res) => {
    try {
        const { entityId, checkin, checkout, rooms, adults, currency } = req.query;

        if (!entityId || !checkin || !checkout || !rooms || !adults || !currency) {
            return res.status(400).json({ error: 'Faltan parámetros en la solicitud' });
        }

        const hotels = await searchHotels(entityId, checkin, checkout, rooms, adults, currency);

        if (hotels.length === 0) {
            return res.status(404).json({ error: 'No se encontraron hoteles' });
        }

        res.json({ hotels });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: 'Ruta de hoteles funcionando' });
});

module.exports = router;
