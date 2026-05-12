import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [budgetMode, setBudgetMode] = useState('budget'); // 'budget' | 'luxury'
  const [moodMode, setMoodMode]     = useState('budget');
  const [itinDest, setItinDest]     = useState('Hyderabad → Goa');
  const [itinBudget, setItinBudget] = useState('₹8,500 / person');
  const [itinDuration, setItinDuration] = useState(3);
  const [itinTravellers, setItinTravellers] = useState(2);
  const [chatMessages, setChatMessages]   = useState([
    {
      role: 'ai',
      content: `Namaste! 🙏 I'm your Eeeztrip AI travel expert. I can help you with:\n\n• 🗺 Destination recommendations & itineraries\n• 💰 Budget breakdowns (train / flight / bus / hotel)\n• 🏨 Hotel suggestions for every budget\n• 🍽 Food & local experience tips\n• 📅 Day-wise trip planning\n• 🎒 Packing & travel advice\n\nWhere would you like to go? Ask me anything!`,
    },
  ]);
  const [pendingChatPrompt, setPendingChatPrompt] = useState('');
  const [itinData, setItinData] = useState(null);
  const [lastGeneratedKey, setLastGeneratedKey] = useState('');

  const navigate = (page) => setCurrentPage(page);

  const sendToAI = (prompt) => {
    setPendingChatPrompt(prompt);
    setCurrentPage('ai');
  };

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      budgetMode, setBudgetMode,
      moodMode, setMoodMode,
      itinDest, setItinDest,
      itinBudget, setItinBudget,
      itinDuration, setItinDuration,
      itinTravellers, setItinTravellers,
      chatMessages, setChatMessages,
      pendingChatPrompt, setPendingChatPrompt,
      itinData, setItinData,
      lastGeneratedKey, setLastGeneratedKey,
      sendToAI,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
