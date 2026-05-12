# Eeeztrip — AI Travel Planner

A full-stack React app for AI-powered travel booking and planning. Features include:

- 🔍 **Search & Book** — Compare trains, flights, buses & hotels by budget/luxury mode
- 🎭 **Mood Planner** — Pick your vibe (relax, adventure, spiritual, etc.) and get AI-curated trip suggestions
- 🤖 **AI Assistant** — Chat with Claude AI for personalized itineraries, budgets, and travel advice
- 📅 **Itinerary View** — Day-wise sample trip plans with cost breakdowns
- 💡 **Travel Tips** — Expert tips for Indian travellers
- 🗺 **Map View** — Visual map of attractions at the destination

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx       # Global state (page nav, budget mode, chat history)
├── components/
│   ├── Navbar.jsx / .css    # Sticky navigation bar
│   ├── Footer.jsx / .css    # Footer
│   ├── ToggleRow.jsx / .css # Reusable budget/luxury toggle
│   ├── TransportCard.jsx / .css  # Transport option card
│   ├── HotelCard.jsx / .css      # Hotel option card
│   └── MapView.jsx / .css        # Illustrated destination map
├── pages/
│   ├── HomePage.jsx / .css       # Search + results page
│   ├── MoodPage.jsx / .css       # Mood-based trip planner
│   ├── AIPage.jsx / .css         # AI chat assistant (Claude API)
│   ├── ItineraryPage.jsx / .css  # Day-wise itinerary + budget
│   └── TipsPage.jsx / .css       # Travel tips grid
├── data/
│   └── travelData.js        # All constants (transport, hotels, moods, tips, chips)
├── styles/
│   └── globals.css          # CSS variables + global reset
├── App.jsx                  # Root component + router
└── index.js                 # Entry point
```

---

## Setup & Run

### Prerequisites
- Node.js v16+ and npm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

The app runs at **http://localhost:3000**

---

## AI Integration (Claude API)

The AI Assistant on the `/ai` page calls the Anthropic Claude API directly from the browser.

> **Note for production:** Move the API call to a backend server (Node/Express) to keep your API key secret.

The AI is prompted to answer as an expert Indian travel guide — giving train/flight/bus prices, hotel suggestions, day-wise itineraries, and budget breakdowns.

---

## Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Framework | React 18               |
| State     | React Context API      |
| Routing   | Custom (useState-based)|
| Styling   | CSS Modules (per-file) |
| AI        | Anthropic Claude API   |
| Fonts     | Google Fonts (Playfair Display + Inter) |

---

## Color Palette

| Token      | Value     | Usage             |
|------------|-----------|-------------------|
| `--brand`  | `#1a3a5c` | Navy blue primary |
| `--brand2` | `#2563eb` | Bright blue       |
| `--accent` | `#f59e0b` | Amber highlights  |
| `--green`  | `#10b981` | Success / eco     |
| `--bg`     | `#f0f4f8` | Page background   |

---

## Features Roadmap (Backend Integration)

- [ ] Real IRCTC / MakeMyTrip API for live prices
- [ ] User authentication & saved trips
- [ ] Payment gateway integration
- [ ] Real Google Maps embed
- [ ] Backend server for secure API key handling
