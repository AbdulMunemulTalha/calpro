import React, { createContext, useContext, useState, useEffect } from 'react';

const StatsContext = createContext(null);

function getInitialStats() {
  try {
    const s = localStorage.getItem('cp_stats');
    return s ? JSON.parse(s) : {
      totalPageViews: 0,
      totalCalcUses: 0,
      dailyViews: {},
      calcUsage: {},
      blogViews: {},
      topPages: {},
      visitors: [],
    };
  } catch { return { totalPageViews: 0, totalCalcUses: 0, dailyViews: {}, calcUsage: {}, blogViews: {}, topPages: {}, visitors: [] }; }
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(getInitialStats);

  const save = (s) => {
    setStats(s);
    localStorage.setItem('cp_stats', JSON.stringify(s));
  };

  const trackPageView = (path) => {
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => {
      const next = {
        ...prev,
        totalPageViews: prev.totalPageViews + 1,
        dailyViews: { ...prev.dailyViews, [today]: (prev.dailyViews[today] || 0) + 1 },
        topPages: { ...prev.topPages, [path]: (prev.topPages[path] || 0) + 1 },
      };
      localStorage.setItem('cp_stats', JSON.stringify(next));
      return next;
    });
  };

  const trackCalcUse = (calcId) => {
    setStats(prev => {
      const next = {
        ...prev,
        totalCalcUses: prev.totalCalcUses + 1,
        calcUsage: { ...prev.calcUsage, [calcId]: (prev.calcUsage[calcId] || 0) + 1 },
      };
      localStorage.setItem('cp_stats', JSON.stringify(next));
      return next;
    });
  };

  const trackBlogView = (slug) => {
    setStats(prev => {
      const next = { ...prev, blogViews: { ...prev.blogViews, [slug]: (prev.blogViews[slug] || 0) + 1 } };
      localStorage.setItem('cp_stats', JSON.stringify(next));
      return next;
    });
  };

  const resetStats = () => save({ totalPageViews: 0, totalCalcUses: 0, dailyViews: {}, calcUsage: {}, blogViews: {}, topPages: {}, visitors: [] });

  return (
    <StatsContext.Provider value={{ stats, trackPageView, trackCalcUse, trackBlogView, resetStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => useContext(StatsContext);
