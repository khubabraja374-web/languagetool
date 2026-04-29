import React, { useState, useEffect } from 'react';
import { Trash2, Mic, Camera, Type } from 'lucide-react';
import { getDeals, clearDeals } from '../services/storage';

const DealLog = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    setDeals(getDeals());
  }, []);

  const handleClear = () => {
    if (window.confirm('هل أنت متأكد من مسح السجل؟ / 确定要清除所有记录吗？')) {
      clearDeals();
      setDeals([]);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'voice': return <Mic size={16} />;
      case 'camera': return <Camera size={16} />;
      case 'text': return <Type size={16} />;
      default: return <Mic size={16} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'voice': return 'صوت';
      case 'camera': return 'كاميرا';
      case 'text': return 'نص';
      default: return '';
    }
  };

  const getTypeColor = (type) => {
    return type === 'camera' ? 'var(--gold)' : 'var(--saudi-green)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid var(--divider)' }}>
        <h2 style={{ color: 'var(--saudi-green)', fontFamily: 'Cairo', margin: 0 }}>سجل الصفقات</h2>
        {deals.length > 0 && (
          <button onClick={handleClear} style={{ color: 'var(--dark-red)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Trash2 size={20} />
            <span style={{ fontFamily: 'Cairo' }}>مسح</span>
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {deals.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <HistoryIcon size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
            <p style={{ fontFamily: 'Cairo', fontSize: '18px' }}>لا توجد محادثات محفوظة بعد</p>
            <p>No saved conversations yet</p>
          </div>
        ) : (
          deals.map((deal) => (
            <div key={deal.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(deal.timestamp).toLocaleString('ar-SA')}
                </span>
                <span style={{ 
                  backgroundColor: getTypeColor(deal.type), color: 'white', padding: '4px 10px', 
                  borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' 
                }}>
                  {getIcon(deal.type)} {getTypeLabel(deal.type)}
                </span>
              </div>
              
              <div style={{ fontFamily: 'Cairo', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', direction: 'auto' }}>
                {deal.translatedText}
              </div>
              
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', direction: 'auto', paddingLeft: '10px', borderLeft: '2px solid var(--divider)' }}>
                {deal.originalText}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper component since lucide doesn't export History with that exact named export natively if not destructured properly sometimes,
// Wait, we imported History in App but here we can just use another icon for empty state if needed.
import { ScrollText as HistoryIcon } from 'lucide-react';

export default DealLog;
