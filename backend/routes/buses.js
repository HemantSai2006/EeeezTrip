const express = require('express');
const router = express.Router();

// A list of popular Indian bus operators to generate realistic data
const operators = [
    "Orange Tours and Travels",
    "IntrCity SmartBus",
    "SRS Travels",
    "VRL Travels",
    "Kaveri Travels",
    "Morning Star Travels",
    "Kallada Travels",
    "SVR Tours & Travels",
    "NueGo"
];

const busTypes = [
    "A/C Sleeper (2+1)",
    "Volvo Multi-Axle A/C Semi Sleeper (2+2)",
    "Non A/C Seater (2+2)",
    "Bharat Benz A/C Sleeper (2+1)",
    "Scania Multi-Axle A/C Semi Sleeper (2+2)"
];

// Simple hash function to generate consistent results for a specific route and date
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

router.get('/search', (req, res) => {
    try {
        const { origin, destination, date } = req.query;

        if (!origin || !destination || !date) {
            return res.status(400).json({ error: "Please provide origin, destination, and date." });
        }

        // Generate a seed based on route and date to ensure same search yields same buses
        const seedStr = `${origin.toLowerCase()}-${destination.toLowerCase()}-${date}`;
        const seed = hashCode(seedStr);

        // Generate between 3 and 8 buses
        const numBuses = 3 + (seed % 6);
        const liveBuses = [];

        for (let i = 0; i < numBuses; i++) {
            const operatorIndex = (seed + i) % operators.length;
            const typeIndex = (seed + i * 2) % busTypes.length;
            
            // Randomize times based on the seed
            const depHour = (seed + i * 3) % 24;
            const depMin = ((seed + i * 7) % 4) * 15; // 0, 15, 30, 45
            
            const durationHours = 5 + ((seed + i) % 10);
            const durationMins = ((seed + i * 5) % 4) * 15;
            
            let arrHour = (depHour + durationHours + Math.floor((depMin + durationMins) / 60)) % 24;
            let arrMin = (depMin + durationMins) % 60;

            const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            
            const basePrice = 600 + ((seed + i * 11) % 1500); // 600 to 2100
            
            liveBuses.push({
                id: `BUS-${seed}-${i}`,
                name: operators[operatorIndex],
                type: busTypes[typeIndex],
                departureTime: formatTime(depHour, depMin),
                arrivalTime: formatTime(arrHour, arrMin),
                duration: `${durationHours}h ${durationMins}m`,
                price: basePrice,
                availableSeats: 2 + ((seed + i * 13) % 30),
                rating: (3.5 + ((seed + i) % 15) / 10).toFixed(1) // 3.5 to 5.0
            });
        }

        // Sort by departure time
        liveBuses.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

        res.json({ buses: liveBuses, isSimulated: true });

    } catch (error) {
        console.error("Bus Search Route Error:", error);
        res.status(500).json({ error: "Failed to fetch bus data." });
    }
});

module.exports = router;
