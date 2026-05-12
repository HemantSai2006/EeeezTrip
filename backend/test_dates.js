const RAPIDAPI_KEY = "b8010073bcmsh4fb732f0939e703p137603jsn72b946a1709f";
const RAPIDAPI_HOST = 'irctc1.p.rapidapi.com';

async function test() {
    const searchUrl1 = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=SC&toStationCode=CCT&dateOfJourney=2026-05-16`;
    const searchUrl2 = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=SC&toStationCode=CCT&dateOfJourney=16-05-2026`;
        
    try {
        const res1 = await fetch(searchUrl1, { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': RAPIDAPI_HOST } });
        const data1 = await res1.json();
        console.log(`Format YYYY-MM-DD (2026-05-16): trains = ${data1.data ? data1.data.length : 0}, message = ${data1.message}`);

        const res2 = await fetch(searchUrl2, { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': RAPIDAPI_HOST } });
        const data2 = await res2.json();
        console.log(`Format DD-MM-YYYY (16-05-2026): trains = ${data2.data ? data2.data.length : 0}, message = ${data2.message}`);
    } catch (e) {
        console.log("Error:", e);
    }
}
test();
