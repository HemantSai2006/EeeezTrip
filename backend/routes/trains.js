const express = require('express');
const router = express.Router();

const RAPIDAPI_KEY = process.env.RAPIDAPI_TRAIN_KEY || process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'irctc1.p.rapidapi.com';

// Dynamic mapper from city to station code using IRCTC1 API
async function getStationCode(query) {
    const searchUrl = `https://irctc1.p.rapidapi.com/api/v1/searchStation?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(searchUrl, {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });
        const data = await response.json();
        if (data.status && data.data && data.data.length > 0) {
            // Check if the query is in the hardcoded map first for major city hubs to ensure accuracy
            const map = {
                'hyderabad': 'SC',
                'mumbai': 'BCT',
                'bangalore': 'SBC',
                'delhi': 'NDLS',
                'chennai': 'MAS',
                'kolkata': 'HWH',
                'pune': 'PUNE',
                'kakinada': 'CCT'
            };
            if (map[query.toLowerCase()]) {
                return map[query.toLowerCase()];
            }
            // Return the code of the first search result
            return data.data[0].code;
        }
        return query.substring(0, 3).toUpperCase();
    } catch (e) {
        console.error("Error looking up station code:", e);
        return query.substring(0, 3).toUpperCase();
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

        const fromStation = await getStationCode(origin);
        const toStation = await getStationCode(destination);

        // Search trains using IRCTC1 RapidAPI
        // Endpoint: /api/v3/trainBetweenStations?fromStationCode=...&toStationCode=...&dateOfJourney=...
        const searchUrl = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${fromStation}&toStationCode=${toStation}&dateOfJourney=${date}`;
        console.log("RapidAPI URL:", searchUrl);
        
        let liveTrains = [];

        const response = await fetch(searchUrl, {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });

        const data = await response.json();

        // If not subscribed, quota exceeded, or failed, we generate mock data based on the route to demonstrate the UI works
        if (data.message && (data.message.includes("not subscribed") || data.message.includes("exceeded"))) {
            console.warn("RapidAPI IRCTC1 not subscribed. Falling back to simulated live data.");
            // Provide simulated data that looks like live data
            liveTrains = [
                {
                    id: `TRN-${Date.now()}-1`,
                    name: `${origin} - ${destination} Express`,
                    trainNumber: '12702',
                    departureTime: '18:30',
                    arrivalTime: '08:45',
                    duration: '14h 15m',
                    price: 1850,
                    class: '3A',
                    available: true
                },
                {
                    id: `TRN-${Date.now()}-2`,
                    name: `Vande Bharat ${origin}`,
                    trainNumber: '20701',
                    departureTime: '06:15',
                    arrivalTime: '14:30',
                    duration: '8h 15m',
                    price: 2450,
                    class: 'CC',
                    available: true
                },
                {
                    id: `TRN-${Date.now()}-3`,
                    name: `${destination} Premium Spl`,
                    trainNumber: '09324',
                    departureTime: '21:00',
                    arrivalTime: '10:00',
                    duration: '13h 00m',
                    price: 1250,
                    class: 'SL',
                    available: true
                }
            ];
        } else if (data.data && Array.isArray(data.data)) {
            // Map the real IRCTC1 data
            liveTrains = data.data.map(train => ({
                id: train.train_number,
                name: train.train_name,
                trainNumber: train.train_number,
                departureTime: train.from_std,
                arrivalTime: train.to_sta,
                duration: train.duration,
                price: 1500, // irctc1 trainBetweenStations often doesn't give price without a separate fare call, so we mock price
                class: train.class_type ? train.class_type.join(', ') : 'SL, 3A, 2A',
                available: true
            }));
        } else {
            // No trains found
            liveTrains = [];
        }

        res.json({ trains: liveTrains, subscriptionWarning: data.message && typeof data.message === 'string' && (data.message.includes('not subscribed') || data.message.includes('exceeded')) });

    } catch (error) {
        console.error("Train Search Route Error:", error);
        res.status(500).json({ error: "Failed to fetch live train data." });
    }
});

module.exports = router;
