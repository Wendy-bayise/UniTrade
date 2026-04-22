const loginScreen = document.getElementById("loginScreen");
const forgotScreen = document.getElementById("forgotScreen");
const signupScreen = document.getElementById("signupScreen");
const feedback = document.getElementById("feedbackMessage");

function showScreen(screen){
    loginScreen.classList.add("hidden");
    forgotScreen.classList.add("hidden");
    signupScreen.classList.add("hidden");
    screen.classList.remove("hidden");
    feedback.textContent = "";
}

function showMessage(message, error=false){
    feedback.textContent = message;
    feedback.style.color = error ? "red" : "green";
}

document.getElementById("forgotBtnLink").onclick = e => {
    e.preventDefault();
    showScreen(forgotScreen);
};

document.getElementById("toSignupLink").onclick = e => {
    e.preventDefault();
    showScreen(signupScreen);
};

document.getElementById("backToLoginFromForgot").onclick = e => {
    e.preventDefault();
    showScreen(loginScreen);
};

document.getElementById("toLoginFromSignup").onclick = e => {
    e.preventDefault();
    showScreen(loginScreen);
};

document.getElementById("loginContinueBtn").onclick = () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if(email === "" || password === ""){
        showMessage("Please fill in all fields", true);
        return;
    }

    showMessage("Login successful");
};

document.getElementById("resetContinueBtn").onclick = () => {
    const email = document.getElementById("resetEmail").value.trim();

    if(email === ""){
        showMessage("Enter your email", true);
        return;
    }

    showMessage("Password reset link sent");
};

document.getElementById("signupContinueBtn").onclick = () => {
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirm = document.getElementById("signupConfirmPassword").value.trim();

    if(username === "" || email === "" || password === "" || confirm === ""){
        showMessage("Please fill in all fields", true);
        return;
    }

    if(password !== confirm){
        showMessage("Passwords do not match", true);
        return;
    }

    showMessage("Account created successfully");
    setTimeout(() => showScreen(loginScreen), 1500);
};
