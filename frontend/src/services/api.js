import axios from 'axios';

// Update this to your deployed backend URL.
// Since we are running locally first, assume FastAPI runs on port 8000.
const API_BASE = 'http://localhost:8000'; 

export const translateText = async (text, sourceLang, targetLang) => {
  try {
    const response = await axios.post(`${API_BASE}/translate`, {
      text,
      source: sourceLang,
      target: targetLang
    });
    return response.data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    return 'حدث خطأ، يرجى المحاولة مرة أخرى / 发生错误，请重试';
  }
};

export const analyzeImage = async (base64Image, targetLang = 'ar') => {
  try {
    const response = await axios.post(`${API_BASE}/vision`, {
      image_base64: base64Image,
      target_lang: targetLang
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Vision API error:', error);
    return 'حدث خطأ في فهم الصورة / 读取图片错误';
  }
};
