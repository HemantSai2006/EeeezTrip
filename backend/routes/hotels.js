const express = require('express');
const router = express.Router();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';

// Hotel brands to generate realistic data
const hotelBrands = [
    "Taj", "Oberoi", "Novotel", "ITC", "Radisson Blu", 
    "Hyatt", "Marriott", "Lemon Tree", "Holiday Inn", "FabHotel"
];

const roomTypes = [
    "Deluxe Room", "Executive Suite", "Standard Double Room", 
    "Premium Room with View", "Family Suite"
];

// Simple hash function
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Format date nicely
function formatDateString(dateStr) {
    if (!dateStr) return '';
    return dateStr;
}

router.get('/search', async (req, res) => {
    try {
        const { destination, checkIn, checkOut, adults, rooms } = req.query;

        if (!destination || !checkIn || !checkOut) {
            return res.status(400).json({ error: "Please provide destination, checkIn, and checkOut dates." });
        }

        let liveHotels = [];
        let isSimulated = false;

        // Try to fetch from a RapidAPI endpoint
        // 1. Search Destination
        const destUrl = `https://${RAPIDAPI_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`;
        
        let rapidApiFailed = false;

        try {
            const destResponse = await fetch(destUrl, {
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST
                }
            });
            const destData = await destResponse.json();

            if (destData.message && (destData.message.includes("not subscribed") || destData.message.includes("exceeded"))) {
                rapidApiFailed = true;
            } else if (destData.status && destData.data && destData.data[0]) {
                const destId = destData.data[0].dest_id;
                
                // 2. Search Hotels
                const searchUrl = `https://${RAPIDAPI_HOST}/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=CITY&arrival_date=${checkIn}&departure_date=${checkOut}&adults=${adults || 1}&room_qty=${rooms || 1}`;
                const hotelRes = await fetch(searchUrl, {
                    headers: {
                        'X-RapidAPI-Key': RAPIDAPI_KEY,
                        'X-RapidAPI-Host': RAPIDAPI_HOST
                    }
                });
                const hotelData = await hotelRes.json();
                
                if (hotelData.data && hotelData.data.hotels) {
                    liveHotels = hotelData.data.hotels.map(h => ({
                        id: h.hotel_id,
                        name: h.property.name,
                        price: h.property.priceBreakdown.grossPrice.value,
                        rating: h.property.reviewScore,
                        reviews: h.property.reviewCount,
                        type: "Standard Room", // Simplified
                        image: h.property.photoUrls[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
                        available: true
                    }));
                } else {
                    rapidApiFailed = true;
                }
            } else {
                rapidApiFailed = true;
            }
        } catch (e) {
            console.error("RapidAPI Error:", e);
            rapidApiFailed = true;
        }

        // If not subscribed, quota exceeded, or failed, we generate mock data
        if (rapidApiFailed) {
            console.warn("RapidAPI Booking not subscribed or failed. Falling back to simulated live data.");
            isSimulated = true;
            
            // Generate a seed based on destination and dates
            const seedStr = `${destination.toLowerCase()}-${checkIn}-${checkOut}`;
            const seed = hashCode(seedStr);

            // Generate between 4 and 10 hotels
            const numHotels = 4 + (seed % 7);

            for (let i = 0; i < numHotels; i++) {
                const brandIndex = (seed + i) % hotelBrands.length;
                const typeIndex = (seed + i * 2) % roomTypes.length;
                
                const basePrice = 2500 + ((seed + i * 17) % 8000); // 2500 to 10500
                const rating = (3.5 + ((seed + i) % 15) / 10).toFixed(1); // 3.5 to 5.0
                const reviews = 50 + ((seed + i * 23) % 950);
                
                const capitalizedDest = destination.charAt(0).toUpperCase() + destination.slice(1);
                
                liveHotels.push({
                    id: `HTL-${seed}-${i}`,
                    name: `${hotelBrands[brandIndex]} ${capitalizedDest}`,
                    price: basePrice,
                    rating: parseFloat(rating),
                    reviews: reviews,
                    type: roomTypes[typeIndex],
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
                    available: true
                });
            }

            // Sort by rating descending
            liveHotels.sort((a, b) => b.rating - a.rating);
        }

        res.json({ hotels: liveHotels, isSimulated });

    } catch (error) {
        console.error("Hotel Search Route Error:", error);
        res.status(500).json({ error: "Failed to fetch hotel data." });
    }
});

module.exports = router;
