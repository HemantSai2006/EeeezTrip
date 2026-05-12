// ===== TRANSPORT OPTIONS =====
export const TRANSPORT = {
  budget: [
    {
      feat: true,
      icon: '🚂',
      badge: 'b-best',
      badgeLabel: '⭐ Best Value',
      name: 'Train — Rajdhani Express',
      price: '₹1,450',
      meta: '~11 hrs • AC 3-Tier • Daily departures',
      url: 'https://www.irctc.co.in',
    },
    {
      feat: false,
      icon: '✈️',
      badge: 'b-fast',
      badgeLabel: '⚡ Fastest',
      name: 'Flight — IndiGo / SpiceJet',
      price: '₹3,200',
      meta: '~1.5 hrs • Direct • Morning slot',
      url: 'https://www.makemytrip.com',
    },
    {
      feat: false,
      icon: '🚌',
      badge: 'b-eco',
      badgeLabel: '🌿 Eco Friendly',
      name: 'AC Sleeper Bus — KSRTC',
      price: '₹800',
      meta: '~13 hrs • AC Sleeper • Overnight',
      url: 'https://www.redbus.in',
    },
  ],
  luxury: [
    {
      feat: true,
      icon: '✈️',
      badge: 'b-lux',
      badgeLabel: '✨ Premium',
      name: 'Business Class — Air India',
      price: '₹18,500',
      meta: '~1.5 hrs • Business Class • Lounge Access',
      url: 'https://www.airindia.com',
    },
    {
      feat: false,
      icon: '✈️',
      badge: 'b-fast',
      badgeLabel: '⚡ Fastest',
      name: 'Flight — Vistara / IndiGo',
      price: '₹8,500',
      meta: '~1.5 hrs • Economy Plus • Flexible dates',
      url: 'https://www.makemytrip.com',
    },
    {
      feat: false,
      icon: '🚂',
      badge: 'b-eco',
      badgeLabel: '🌿 First Class',
      name: 'Train — Vande Bharat 1AC',
      price: '₹4,200',
      meta: '~11 hrs • First Class • Meals included',
      url: 'https://www.irctc.co.in',
    },
  ],
};

// ===== HOTEL OPTIONS =====
export const HOTELS = {
  budget: [
    { bg: '#fef9e7', icon: '🏨', badge: 'b-bdg', badgeLabel: '💰 Budget', name: 'Zostel Goa', stars: '★★★', rating: '3 Star', price: '₹700', meta: 'Breakfast incl. • Free WiFi • Pool • Social Area', url: 'https://www.zostel.com' },
    { bg: '#ecfdf5', icon: '🌴', badge: 'b-bdg', badgeLabel: '💰 Budget', name: 'Beach Paradise Inn', stars: '★★★', rating: '3 Star', price: '₹950', meta: 'Sea View • AC • Rooftop Café • Free Parking', url: 'https://www.booking.com' },
    { bg: '#f0fdf4', icon: '🛏', badge: 'b-bdg', badgeLabel: '💰 Budget', name: 'Treebo Trend Oasis', stars: '★★★', rating: '3 Star', price: '₹1,100', meta: 'City Centre • AC • Restaurant • Laundry', url: 'https://www.treebo.com' },
    { bg: '#eff6ff', icon: '🌊', badge: 'b-bdg', badgeLabel: '💰 Budget', name: 'Surfers Corner Hostel', stars: '★★★', rating: '3 Star', price: '₹650', meta: 'Steps from beach • Dorms & Private • Surf lessons', url: 'https://www.hostelworld.com' },
  ],
  luxury: [
    { bg: '#fdf4ff', icon: '🏩', badge: 'b-lux', badgeLabel: '✨ Luxury', name: 'Taj Vivanta Goa', stars: '★★★★★', rating: '5 Star', price: '₹7,500', meta: 'Private Pool • Spa • Concierge • Fine Dining', url: 'https://www.tajhotels.com' },
    { bg: '#eff6ff', icon: '🛁', badge: 'b-lux', badgeLabel: '✨ Luxury', name: 'W Goa Resort', stars: '★★★★★', rating: '5 Star', price: '₹9,200', meta: 'Infinity Pool • Butler Service • Multiple Restaurants', url: 'https://www.marriott.com' },
    { bg: '#fef3c7', icon: '🌅', badge: 'b-lux', badgeLabel: '✨ Luxury', name: 'Park Hyatt Goa', stars: '★★★★★', rating: '5 Star', price: '₹11,000', meta: 'Beachfront • Water Sports • Casino • Spa & Wellness', url: 'https://www.hyatt.com' },
    { bg: '#f0fdf4', icon: '🌺', badge: 'b-lux', badgeLabel: '✨ Luxury', name: 'The Leela Goa', stars: '★★★★★', rating: '5 Star', price: '₹13,500', meta: 'Heritage property • 75-acre estate • 3 Pools • Spa', url: 'https://www.theleela.com' },
  ],
};

// ===== MAP PINS =====
export const MAP_PINS = [
  { name: 'Baga Beach', top: '30%', left: '22%', icon: '🏖' },
  { name: 'Old Goa',    top: '52%', left: '50%', icon: '⛪' },
  { name: 'Dudhsagar', top: '20%', left: '68%', icon: '💧' },
  { name: 'Anjuna',    top: '62%', left: '33%', icon: '🛍' },
  { name: 'Palolem',   top: '74%', left: '56%', icon: '🌴' },
];

// ===== MOOD DATA =====
export const MOODS = {
  relax: {
    emoji: '😌',
    label: 'Relax',
    sub: 'Beaches & spas',
    title: '😌 Relax & Unwind',
    destinations: ['Goa', 'Pondicherry', 'Andaman Islands'],
    budgetCost: '₹8,000–₹12,000',
    luxuryCost: '₹35,000–₹60,000',
    budgetHotels: 'Zostel, La Maison Pondicherry, Seagull',
    luxuryHotels: 'Taj Exotica, W Goa, Palais de Mahe',
    places: '🏖 Baga Beach • 🌅 Promenade Pondy • 🤿 Radhanagar Beach • 🧘 Auroville',
  },
  adventure: {
    emoji: '🧗',
    label: 'Adventure',
    sub: 'Hikes & thrills',
    title: '🧗 Adventure & Thrills',
    destinations: ['Manali', 'Rishikesh', 'Coorg'],
    budgetCost: '₹7,500–₹11,000',
    luxuryCost: '₹25,000–₹45,000',
    budgetHotels: 'Zostel Manali, Camp Riverside, Backpacker Inn',
    luxuryHotels: 'Solang Valley Resort, Ananda Spa',
    places: '⛰ Rohtang Pass • 🌊 River Rafting • 🪂 Paragliding • 🏔 Spiti Valley',
  },
  spiritual: {
    emoji: '🕌',
    label: 'Spiritual',
    sub: 'Temples & peace',
    title: '🕌 Spiritual Journey',
    destinations: ['Varanasi', 'Tirupati', 'Haridwar'],
    budgetCost: '₹5,000–₹8,000',
    luxuryCost: '₹18,000–₹30,000',
    budgetHotels: 'Zostel Varanasi, Ganges View, Ashrams',
    luxuryHotels: 'Taj Hotel Varanasi, BrijRama Palace',
    places: '🪔 Kashi Vishwanath • 🛕 Ganga Aarti • 🕍 Sarnath • ⛩ Har ki Pauri',
  },
  party: {
    emoji: '🎉',
    label: 'Party & Fun',
    sub: 'Nightlife & vibes',
    title: '🎉 Party & Nightlife',
    destinations: ['Goa', 'Mumbai', 'Bangalore'],
    budgetCost: '₹10,000–₹15,000',
    luxuryCost: '₹45,000–₹80,000',
    budgetHotels: 'Zostel Goa, Backpacker Hostel, Party Inn',
    luxuryHotels: 'W Goa, JW Marriott Mumbai, The Leela',
    places: "🎵 Tito's Lane • 🌃 Bandra Mumbai • 🎶 Leopard Valley • 🍹 Curlies",
  },
  family: {
    emoji: '👨‍👩‍👧',
    label: 'Family',
    sub: 'Kid-friendly fun',
    title: '👨‍👩‍👧 Family Fun',
    destinations: ['Ooty', 'Mysore', 'Coorg'],
    budgetCost: '₹12,000–₹18,000',
    luxuryCost: '₹40,000–₹65,000',
    budgetHotels: 'KSTDC Hotels, Hotel Mayura, Jungle Lodges',
    luxuryHotels: 'Orange County, Taj Madikeri, Evolve Back',
    places: '🌿 Botanical Garden • 🏰 Mysore Palace • 🐘 Safari • 🌊 Pykara Falls',
  },
  romance: {
    emoji: '💑',
    label: 'Romantic',
    sub: 'Couples getaway',
    title: '💑 Romantic Getaway',
    destinations: ['Udaipur', 'Kashmir', 'Coorg'],
    budgetCost: '₹15,000–₹22,000',
    luxuryCost: '₹60,000–₹1,20,000',
    budgetHotels: 'Zostel Udaipur, Lake Shore, Houseboats',
    luxuryHotels: 'Taj Lake Palace, The Lalit Grand, Wildflower Hall',
    places: '💕 Lake Pichola • 🛶 Shikara Dal Lake • 🌸 Mughal Gardens • 🌅 Mehrangarh',
  },
};

// ===== OFFERS =====
export const OFFERS = [
  { style: { background: 'linear-gradient(135deg, #1a3a5c, #2563eb)' }, label: 'Limited Offer', value: '20% OFF', sub: 'On all train bookings this week' },
  { style: { background: 'linear-gradient(135deg, #d97706, #f59e0b)' }, label: 'Flash Sale', value: 'Flights from ₹999', sub: 'Hyderabad → Goa • Book now' },
  { style: { background: 'linear-gradient(135deg, #059669, #10b981)' }, label: 'Hotel Deal', value: 'Stay 3 Pay 2', sub: 'Premium beach resorts • Goa' },
  { style: { background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }, label: 'Mood Trip', value: 'AI Plans Free', sub: 'Personalised mood-based trips' },
];

// ===== CHAT CHIPS =====
export const CHAT_CHIPS = [
  { label: '🏖 Budget beaches', prompt: 'Best budget beach destinations in India under ₹10,000?' },
  { label: '📅 3-day Goa plan', prompt: 'Plan a 3-day Goa itinerary for ₹8,000 from Hyderabad' },
  { label: '🕌 Spiritual trips', prompt: 'Top spiritual destinations in India with travel budget?' },
  { label: '❄ Manali guide', prompt: 'Best time and budget for Manali trip?' },
  { label: '🧗 Rishikesh adventure', prompt: 'Complete Rishikesh adventure trip plan with costs?' },
  { label: '💑 Romantic getaways', prompt: 'Best romantic destinations in India for couples under ₹25,000?' },
  { label: '📋 Travel documents', prompt: 'What documents do I need to travel to Andaman from mainland India?' },
  { label: '👨‍👩‍👧 Family Kerala', prompt: 'Budget-friendly family trip to Kerala for 5 days?' },
];

// ===== TRAVEL TIPS =====
export const TRAVEL_TIPS = [
  { icon: '🚂', title: 'Book trains early', text: 'Tatkal opens 1 day before. General quota: 90 days ahead on IRCTC. Set early morning alarms for popular routes.' },
  { icon: '✈️', title: 'Flight price trick', text: 'Flights are cheapest on Tuesdays & Wednesdays. Book 6–8 weeks ahead. Use incognito mode to avoid price tracking.' },
  { icon: '🏨', title: 'Hotel booking hack', text: "Always compare Booking.com, MakeMyTrip & hotel's own site. Direct bookings often cheaper. Ask for free upgrades." },
  { icon: '💳', title: 'Money & ATMs', text: 'Carry cash in hill stations & beaches. UPI works everywhere in cities. Inform bank before travel to avoid card blocks.' },
  { icon: '🌦', title: 'Best travel months', text: 'Oct–Mar is peak season for most India destinations. Monsoon (Jun–Sep) has lush scenery but some roads close.' },
  { icon: '🎒', title: 'Packing light tips', text: 'Pack half of what you think you need. India has affordable shopping. Roll clothes to save space. 1 bag = no hassle.' },
  { icon: '🍽', title: 'Eat local, save big', text: 'Dhabas & thali restaurants give authentic food for ₹100–200. Avoid tourist restaurants near monuments — 3x markup.' },
  { icon: '🚌', title: 'Bus booking tips', text: 'Use RedBus for comparing operators. Volvo AC sleeper buses are comfortable for overnight. Window seats = better views.' },
  { icon: '📱', title: 'Essential travel apps', text: 'IRCTC Rail Connect, MakeMyTrip, RedBus, Google Maps (offline), Google Translate, Splitwise for group trips.' },
  { icon: '🩺', title: 'Health & safety', text: 'Carry ORS, basic medicines. Drink bottled water. Travel insurance is ₹300–500 for a week — worth it! Share itinerary with family.' },
  { icon: '🎫', title: 'Entry ticket saving', text: 'ASI sites: free for under-15 & international sites have student discount. Book heritage walks separately — cheaper & better.' },
  { icon: '🤖', title: 'Use AI to plan', text: 'Ask our AI assistant for custom itineraries based on your budget. It compares transport & finds the best options instantly!' },
];
