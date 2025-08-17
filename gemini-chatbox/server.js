// Impor modul yang diperlukan
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Untuk memuat variabel lingkungan dari file .env

// Inisialisasi aplikasi Express
const app = express();
const port = process.env.PORT || 8080;

// Middleware untuk parsing JSON dan melayani file statis dari folder 'public'
app.use(express.json());
app.use(express.static('public'));

// Ambil API Key dari variabel lingkungan
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error("Error: GEMINI_API_KEY tidak ditemukan di file .env");
  process.exit(1);
}

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Definisikan endpoint untuk chat
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    // Kirim pesan ke model Gemini dan dapatkan hasilnya
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Kirim kembali respons dari AI
    res.json({ reply: text });

  } catch (error) {
    console.error('Error saat berkomunikasi dengan Gemini API:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
