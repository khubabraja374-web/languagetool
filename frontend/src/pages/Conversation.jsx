import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Share2, Trash2, Scan, Globe, PlayCircle, Loader2, LogOut } from 'lucide-react';
import { BottomNav } from '../App';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LANG = {
  ar: { locale: 'ar-SA', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  zh: { locale: 'zh-CN', label: '中文', flag: '🇨🇳', dir: 'ltr' },
};

// ─── Core Logic (Stabilized) ─────────────────────────────────────────
async function speakFromBackend(text, lang) {
  if (!text) return;
  try {
    const res = await fetch(`${API_BASE}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang: lang.startsWith('zh') ? 'zh' : 'ar' })
    });
    const data = await res.json();
    if (!data.audio) return;
    const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
    const playPromise = audio.play();
    if (playPromise !== undefined) playPromise.catch(() => {});
  } catch (err) { console.error("Sound playback failed"); }
}

async function translateText(text, source, target) {
  try {
    const res = await fetch(`${API_BASE}/translate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source, target }),
    });
    const data = await res.json();
    return data.translation || '';
  } catch (err) { return "Translation error"; }
}

export default function Conversation({ onLogout }) {
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('deal_chat_v4') || '[]'));
  const [mode, setMode] = useState('voice');
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(null);
  const [status, setStatus] = useState('');
  
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('deal_chat_v4', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Robust Listen Engine for LONG sentences
  const listen = useCallback(({ locale, onEnd }) => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Please use Chrome for voice translation.");
      return;
    }
    const r = new SpeechRecognition();
    r.lang = locale;
    r.continuous = false; // Stop at large pauses to process bulk
    r.interimResults = false;
    
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      r.stop();
      onEnd(transcript);
    };
    
    r.onerror = (err) => {
      setRecording(null);
      setStatus('');
    };
    
    r.onend = () => setRecording(null);
    r.start();
  }, []);

  const handleMic = (lang) => {
    if (recording) return;
    setRecording(lang);
    setStatus('🔴 Listening... / جاري الاستماع');
    
    listen({
      locale: LANG[lang].locale,
      onEnd: async (text) => {
        if (!text) { setStatus(''); return; }
        const target = lang === 'ar' ? 'zh' : 'ar';
        setStatus('✨ Translating large text...');
        const translated = await translateText(text, lang, target);
        setMessages(p => [...p, { id: Date.now(), speaker: lang, original: text, translated }]);
        speakFromBackend(translated, target);
        setStatus('');
      }
    });
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const text = inputText; setInputText('');
    const lang = /[\u0600-\u06FF]/.test(text) ? 'ar' : 'zh';
    const target = lang === 'ar' ? 'zh' : 'ar';
    setStatus('Translating...');
    const translated = await translateText(text, lang, target);
    setMessages(p => [...p, { id: Date.now(), speaker: lang, original: text, translated }]);
    speakFromBackend(translated, target);
    setStatus('');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
      <header className="glass-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="action-btn" onClick={onLogout} style={{ background: 'rgba(238,28,37,0.1)', color: '#EE1C25' }}>
            <LogOut size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900 }}>Companion</h1>
            <p style={{ fontSize: 9, opacity: 0.6, fontWeight: 800 }}>V4.0 - STABLE</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="action-btn" onClick={() => { if (confirm('Clear session?')) setMessages([]) }} title="Clear Chat"><Trash2 size={18}/></button>
          <button className="action-btn" style={{ background: 'var(--gold-gradient)', color: '#fff' }} onClick={() => {
            const log = messages.map(m => `${m.speaker === 'ar' ? '🇸🇦' : '🇨🇳'} ${m.original}\n✨ ${m.translated}`).join('\n\n');
            window.open(`https://wa.me/?text=${encodeURIComponent(log)}`);
          }}><Share2 size={16}/></button>
        </div>
      </header>

      <main ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '160px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.2 }}>
            <div style={{ fontSize: 50, marginBottom: 10 }}>🇸🇦 🤝 🇨🇳</div>
            <p style={{ fontWeight: 800 }}>Secure Global Bridge</p>
            <p style={{ fontSize: 12 }}>Speak freely for as long as you need.</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{ alignSelf: m.speaker === 'ar' ? 'flex-end' : 'flex-start', maxWidth: '85%', animation: 'slideInUp 0.3s ease' }}>
            <div className={m.speaker === 'ar' ? 'chat-bubble-ar' : 'chat-bubble-zh'} style={{ direction: LANG[m.speaker]?.dir || 'ltr' }}>
              {m.original}
            </div>
            {m.translated && (
              <div style={{ marginTop: 6, background: '#fff', padding: '12px', borderRadius: 16, fontSize: 14, color: '#333', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 10, direction: m.speaker === 'ar' ? 'ltr' : 'rtl' }}>
                <span style={{ flex: 1 }}>{m.translated}</span>
                <button onClick={() => speakFromBackend(m.translated, m.speaker === 'ar' ? 'zh' : 'ar')} style={{ background: 'none', border: 'none', color: 'var(--saudi-green)' }}><PlayCircle size={20} /></button>
              </div>
            )}
          </div>
        ))}
        {status && <div style={{ fontSize: 12, color: 'var(--saudi-green)', fontWeight: 800, textAlign: 'center', padding: 10, animation: 'pulse 1.5s infinite' }}>{status}</div>}
      </main>

      <footer style={{ position: 'fixed', bottom: 75, left: 0, right: 0, zIndex: 1000, background: '#fff', borderTop: '1px solid #eee' }}>
        <div style={{ padding: '15px 20px' }}>
          <div style={{ display: 'flex', background: '#f1f3f5', padding: 4, borderRadius: 12, marginBottom: 12 }}>
             <button onClick={() => setMode('voice')} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === 'voice' ? '#fff' : 'transparent', fontWeight: 800 }}>VOICE</button>
             <button onClick={() => setMode('text')} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === 'text' ? '#fff' : 'transparent', fontWeight: 800 }}>TEXT</button>
          </div>
          {mode === 'voice' ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handleMic('ar')} style={{ flex: 1, height: 70, background: recording === 'ar' ? '#333' : 'var(--saudi-green-gradient)', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Mic size={24} /> <span style={{ fontWeight: 800, fontSize: 12 }}>🇸🇦 SAUDI</span>
              </button>
              <button onClick={() => handleMic('zh')} style={{ flex: 1, height: 70, background: recording === 'zh' ? '#333' : 'var(--zh-red-gradient)', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Mic size={24} /> <span style={{ fontWeight: 800, fontSize: 12 }}>🇨🇳 CHINESE</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, background: '#f8f9fa', padding: 6, borderRadius: 16, border: '1px solid #eee' }}>
              <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendText()} placeholder="Type here..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, paddingLeft: 10 }} />
              <button onClick={handleSendText} style={{ background: 'var(--saudi-green)', color: '#fff', border: 'none', width: 44, height: 44, borderRadius: 12 }}><Send size={20}/></button>
            </div>
          )}
        </div>
      </footer>
      <BottomNav />
    </div>
  );
}
