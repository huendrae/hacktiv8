document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatWindow = document.getElementById('chat-window');
    const loader = document.getElementById('loader');

    // Fungsi untuk menambahkan pesan ke jendela chat
    const addMessage = (sender, text) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        // Mengganti newline dengan <br> untuk rendering HTML
        messageElement.innerHTML = text.replace(/\n/g, '<br>');

        chatWindow.appendChild(messageElement);
        // Scroll ke pesan terbaru
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // Fungsi untuk menampilkan atau menyembunyikan loader
    const toggleLoader = (show) => {
        loader.style.display = show ? 'flex' : 'none';
    };

    // Event listener untuk form pengiriman pesan
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah form dari reload halaman

        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        // Tampilkan pesan pengguna di chat
        addMessage('user', userMessage);
        messageInput.value = ''; // Kosongkan input field
        toggleLoader(true); // Tampilkan loader

        try {
            // Kirim pesan ke backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Tampilkan balasan dari AI
            addMessage('ai', data.reply);

        } catch (error) {
            console.error('Error:', error);
            addMessage('ai', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
        } finally {
            toggleLoader(false); // Sembunyikan loader
        }
    });

    // Tambahkan pesan sambutan awal
    addMessage('ai', 'Halo! Saya Gemini. Ada yang bisa saya bantu?');
});
