import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
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
});
