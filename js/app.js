const firebaseConfig = {
    apiKey: "AIzaSyCTG4dGPl2g-91KyhQ6pAnmUUZ7gEdYA_U",
    authDomain: "planetpledgeform-8351f.firebaseapp.com",
    databaseURL: "https://planetpledgeform-8351f-default-rtdb.firebaseio.com",
    projectId: "planetpledgeform-8351f",
    storageBucket: "planetpledgeform-8351f.appspot.com",
    messagingSenderId: "716897204811",
    appId: "1:716897204811:web:44025dd86c0eafa2816bce"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const googleBtn = document.getElementById('google-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const authMessage = document.getElementById('auth-message');

function showLoading(show) {
    loadingSpinner.classList.toggle('hidden', !show);
}

// Sign up with email and password
signupBtn.addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    showLoading(true);
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Send email verification
            return user.sendEmailVerification().then(() => {
                authMessage.textContent = "Verification email sent. Please check your inbox to verify your email.";
            }).then(() => {
                return db.ref('users/' + user.uid).set({
                    email: user.email,
                    uid: user.uid,
                    memberSince: Date.now(),
                    totalDonations: 0,
                });
            });
        })
        .then(() => {
            showLoading(false);
            // Optionally, redirect to a page indicating the need for email verification
        })
        .catch((error) => {
            showLoading(false);
            authMessage.textContent = error.message;
        });
});

// Login with email and password
loginBtn.addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    showLoading(true);
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                // Email is verified, redirect to loghome.html
                showLoading(false);
                window.location.href = 'loghome.html';
            } else {
                // Email is not verified, show a message
                showLoading(false);
                authMessage.textContent = "Please verify your email address before logging in.";
                auth.signOut(); // Log the user out if email is not verified
            }
        })
        .catch((error) => {
            showLoading(false);
            authMessage.textContent = error.message;
        });
});

// Google Login/Signup
googleBtn.addEventListener('click', function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    showLoading(true);
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;

            // Check if user is newly created
            if (result.additionalUserInfo.isNewUser) {
                // If it's a new user, add to the database
                return db.ref('users/' + user.uid).set({
                    email: user.email,
                    uid: user.uid,
                    profilePicture: user.photoURL,
                    displayName: user.displayName
                }).then(() => {
                    return user.sendEmailVerification().then(() => {
                        authMessage.textContent = "Verification email sent. Please check your inbox to verify your email.";
                        showLoading(false);
                    });
                });
            } else {
                // Existing user, redirect to loghome.html
                showLoading(false);
                window.location.href = 'loghome.html';
            }
        })
        .catch((error) => {
            showLoading(false);
            authMessage.textContent = error.message;
        });
});

document.getElementById('forgot-password-btn').addEventListener('click', function () {
    const email = document.getElementById('email').value;

    if (!email) {
        document.getElementById('auth-message').textContent = "Please enter your email to reset your password.";
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            document.getElementById('auth-message').textContent = "Password reset email sent! Please check your inbox.";
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
});

function logout() {
    auth.signOut()
        .then(() => {
            document.getElementById('header-placeholder').innerHTML = `<button id="login-btn">Login</button>`;
        })
        .catch((error) => {
            console.log(error.message);
        });
}
