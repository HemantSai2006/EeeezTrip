async function test() {
    try {
        const url = `http://localhost:5000/api/trains/search?origin=hyderabad&destination=kakinada&date=2026-05-16`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
