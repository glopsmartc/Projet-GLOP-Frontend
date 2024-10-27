// src/assets/config.js
window.config = {
    apiBaseUrl: window.API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'http://172.28.100.191:80')
};
