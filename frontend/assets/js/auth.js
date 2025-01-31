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

    console.log("Checking authentication...");
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        console.log("Redirecting due to missing token");

        redirectToLogin();
        return;
    }

    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) {
        console.log("Redirecting due to invalid token");
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
        console.log("About to check auth!");
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
            api.post("token/", { username, password })
                .then(response => {
                    if (response.status !== 200) {
                        alert("Login failed.");
                        throw new Error("Login failed.");
                    } else {
                        localStorage.setItem("accessToken", response.data.access); // Store access token
                        localStorage.setItem("refreshToken", response.data.refresh); // Store refresh token
                        localStorage.setItem("username", username);
                        window.location.href = "pages/time-entries.html"; // Redirect to home
                    }
                   
                })

        } catch (error) {
            console.log("Your error is: ", error);
            errorMessage.textContent = error.response?.data?.message || "Login failed.";
            errorMessage.style.display = "block";
        }
    });

    }
    });


