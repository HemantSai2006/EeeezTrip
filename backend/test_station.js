const RAPIDAPI_KEY = "b8010073bcmsh4fb732f0939e703p137603jsn72b946a1709f";
const RAPIDAPI_HOST = 'irctc1.p.rapidapi.com';

async function test() {
    const searchUrl = `https://irctc1.p.rapidapi.com/api/v1/searchStation?query=kakinada`;
        
    const response = await fetch(searchUrl, {
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        }
    });

    const data = await response.json();
    console.log(`Station found:`, JSON.stringify(data));
}

test();
