const RAPIDAPI_KEY = "b8010073bcmsh4fb732f0939e703p137603jsn72b946a1709f";
const RAPIDAPI_HOST = 'irctc1.p.rapidapi.com';

async function test() {
    const searchUrl = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=SC&toStationCode=COA&dateOfJourney=2026-05-16`;
        
    const response = await fetch(searchUrl, {
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        }
    });

    const data = await response.json();
    console.log(`Trains found SC to COA:`, data.data ? data.data.length : 0);
}

test();
