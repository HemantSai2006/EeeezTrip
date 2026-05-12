const express = require('express');
const router = express.Router();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'flights-sky.p.rapidapi.com';

// Helper function to get entityId from city/airport name
async function getEntityId(query) {
    const url = `https://flights-sky.p.rapidapi.com/flights/auto-complete?query=${encodeURIComponent(query)}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Auto-complete failed: ${response.statusText}`);
        }
        const json = await response.json();
        if (json.data && json.data.length > 0) {
            // Get the first result's skyId (which is what the search API actually expects)
            return json.data[0].navigation.relevantFlightParams.skyId;
        }
        return null;
    } catch (error) {
        console.error("Error fetching entity ID for:", query, error);
        return null;
    }
}

router.get('/search', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;

        if (!origin || !destination || !date) {
            return res.status(400).json({ error: "Please provide origin, destination, and date." });
        }

        if (!RAPIDAPI_KEY) {
            return res.status(500).json({ error: "RapidAPI Key is missing in backend .env file." });
        }

        // 1. Resolve entity IDs
        const originId = await getEntityId(origin);
        const destId = await getEntityId(destination);

        if (!originId || !destId) {
            return res.status(404).json({ error: "Could not find airports for the given origin/destination." });
        }

        // 2. Search flights with Indian currency
        const searchUrl = `https://flights-sky.p.rapidapi.com/flights/search-one-way?fromEntityId=${originId}&toEntityId=${destId}&departDate=${date}&currency=INR&market=IN`;
        
        const response = await fetch(searchUrl, {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });

        if (!response.ok) {
             throw new Error(`Flight search failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if there are itineraries
        if (!data.data || !data.data.itineraries || data.data.itineraries.length === 0) {
             return res.json({ flights: [] });
        }

        // Map the complicated RapidAPI structure to a cleaner one for our frontend
        const flights = data.data.itineraries.map(itin => {
            const leg = itin.legs[0]; // Assuming one-way, we just take the first leg
            return {
                id: itin.id,
                price: itin.price.formatted,
                rawPrice: itin.price.raw,
                airline: leg.carriers.marketing[0].name,
                airlineLogo: leg.carriers.marketing[0].logoUrl,
                origin: leg.origin.name,
                originDisplayCode: leg.origin.displayCode,
                destination: leg.destination.name,
                destinationDisplayCode: leg.destination.displayCode,
                departureTime: leg.departure,
                arrivalTime: leg.arrival,
                durationInMinutes: leg.durationInMinutes,
                stopCount: leg.stopCount
            };
        });

        res.json({ flights });

    } catch (error) {
        console.error("Flight Search Route Error:", error);
        res.status(500).json({ error: "Failed to fetch live flight data." });
    }
});

module.exports = router;
