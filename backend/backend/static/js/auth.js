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

export default function checkAuth() {

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
    window.location.href = "/";
}

console.log("Oh this is running baby");
// Run authentication check when the page loads
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        return;
    }
    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");
        
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid #ccc;border-top:2px solid #333;border-radius:50%;animation:spin 1s linear infinite;vertical-align:middle;margin-right:8px;"></span>Logging you in`;

        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
        }`;
        document.head.appendChild(style);

        try {
            const tokenPromise = api.post("token/", { username, password });
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.startsWith(name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            const csrftoken = getCookie('csrftoken');
            const loginPromise =  api.post("loginUser/", { "username": username, "password": password }, {
                headers: {
                    "X-CSRFToken": csrftoken,
                    "Content-Type": "application/json"
                }
            });

            const [tokenResponse, loginResponse] = await Promise.all([tokenPromise, loginPromise]);

            localStorage.setItem(ACCESS_TOKEN, tokenResponse.data.access); // Store access token
            localStorage.setItem(REFRESH_TOKEN, tokenResponse.data.refresh); // Store refresh token
            localStorage.setItem("username", username);
            window.location.href ="/time_entries"; // Redirect to home
            }

         catch (error) {
            if (error.response && error.response.status === 401) {
                errorMessage.textContent = 'Usuario o contraseña incorrecta, por favor inténtelo de nuevo .';
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText; // Reset button text
            } else {
                errorMessage.textContent = 'Ocurrió un error, por favor inténtelo de nuevo';
                console.error("Login failed:", error);
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText; // Reset button text
            }
        }
    });

    const forgotPasswordLink = document.getElementById("forgot-password-text");
    
    forgotPasswordLink.addEventListener("click", async (event) => {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = 'Para restablecer su contraseña, contacte a quien mantiene este sistema. Actualmente esa persona es ulises@dive.ai';
    });
});



