import api from "./api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants.js";


function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

async function refreshTokenCall() {

    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
        redirectToLogin();
        return;
    }

    try {
        const response = await api.post("token/refresh/", { refresh: refreshToken });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(accessToken, data.access);
            checkAuth(); // Re-run authentication check
        } else {
            redirectToLogin();
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        redirectToLogin();
    }
}

function checkAuth() {

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {

        redirectToLogin();
        return;
    }

    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) {
        redirectToLogin();
        return;
    }
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
        refreshTokenCall();
    } else {
        document.body.style.display = "block"; // Show content after validation
    }
}

function redirectToLogin() {
    window.location.href = "/index.html";
}

// Run authentication check when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
        checkAuth();
    }
    else{

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");
 
        try {
            const data = await api.post("token/", { username, password });
    
            localStorage.setItem(ACCESS_TOKEN, data.data.access); // Store access token
            localStorage.setItem(REFRESH_TOKEN, data.data.refresh); // Store refresh token
            localStorage.setItem("username", username);
            window.location.href = "pages/time-entries.html"; // Redirect to home
            }

         catch (error) {
            if (error.response && error.response.status === 401) {
                errorMessage.textContent = 'Usuario o contraseña incorrecta, por favor inténtelo de nuevo .';
            } else {
                errorMessage.textContent = 'Ocurrió un error, por favor inténtelo de nuevo';
                console.error("Login failed:", error);
            }
        }
    });

    }
    });


