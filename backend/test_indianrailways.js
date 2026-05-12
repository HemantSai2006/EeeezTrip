const RAPIDAPI_KEY = "b8010073bcmsh4fb732f0939e703p137603jsn72b946a1709f";
const RAPIDAPI_HOST = 'indianrailways.p.rapidapi.com';

async function test(path) {
    console.log(`Testing ${path}`);
    try {
        const response = await fetch(`https://${RAPIDAPI_HOST}${path}`, {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });
        const data = await response.text();
        console.log(`Response:`, data.substring(0, 200));
    } catch (e) {
        console.log(`Error:`, e.message);
    }
}

async function run() {
    await test('/');
    await test('/trains');
    await test('/api/v1/trains');
    await test('/findbystation');
    await test('/station');
    await test('/trainbetweenstations');
}
run();
