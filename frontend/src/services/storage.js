import { v4 as uuidv4 } from 'uuid';

export const saveDeal = (type, originalText, translatedText) => {
  const history = getDeals();
  const newEntry = {
    id: uuidv4(),
    type, // 'voice', 'text', 'camera'
    originalText,
    translatedText,
    timestamp: new Date().toISOString()
  };
  history.unshift(newEntry);
  // Limit to 100
  if (history.length > 100) {
    history.pop();
  }
  localStorage.setItem('deal_history', JSON.stringify(history));
  return newEntry;
};

export const getDeals = () => {
  const data = localStorage.getItem('deal_history');
  return data ? JSON.parse(data) : [];
};

export const clearDeals = () => {
  localStorage.removeItem('deal_history');
};
