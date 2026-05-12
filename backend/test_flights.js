const RAPIDAPI_KEY = "b8010073bcmsh4fb732f0939e703p137603jsn72b946a1709f";
const RAPIDAPI_HOST = 'flights-sky.p.rapidapi.com';

async function test() {
    const searchUrl = `https://flights-sky.p.rapidapi.com/flights/search-one-way?fromEntityId=HYD&toEntityId=IGOI&departDate=2026-05-21`;
    console.log("Search URL:", searchUrl);
        
    const response = await fetch(searchUrl, {
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        }
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

test();
