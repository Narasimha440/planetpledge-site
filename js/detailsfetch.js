const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    databaseURL: "YOUR-DATABASE-URL",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function showDeletePopup() {
    document.getElementById('deletePopup').classList.remove('hidden');
}

function hideDeletePopup() {
    document.getElementById('deletePopup').classList.add('hidden');
}

function deleteAccount() {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const userRef = firebase.database().ref('users/' + uid);

    userRef.remove()
        .then(() => {
            console.log("User data deleted from Realtime Database");

            return user.delete();
        })
        .then(() => {
            console.log("User account deleted from firebase authentication.");
            window.location.href = 'form.html';
        })
        .catch(error => {
            console.error("Error deleting user account:", error);
            if (error.code === 'auth/requires-recent-login') {
                window.location.href = 'form.html';
            }
        });
}

document.getElementById('confirmDelete').addEventListener('click', () => {
    deleteAccount();
    hideDeletePopup();
});

document.getElementById('cancelDelete').addEventListener('click', hideDeletePopup);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const uid = user.uid;
        const email = user.email;
        const defaultUsername = email.split('@')[0];
        const userRef = firebase.database().ref('users/' + uid);

        userRef.once('value').then(snapshot => {
            const userData = snapshot.val();
            if (userData) {
                const username = userData.username || defaultUsername;
                updateProfileUI(username, email, userData);
            } else {
                console.error("User data not found in the database.");
            }
        }).catch(error => {
            console.error("Error fetching user data from Firebase:", error);
        });
    } else {
        window.location.href = 'form.html';
    }
});

// Function to update the profile UI
function updateProfileUI(username, email, userData) {
    const usernameElem = document.getElementById('username');
    const emailElem = document.getElementById('email');
    const accountTypeElem = document.getElementById('account-type');
    const memberSinceElem = document.getElementById('member-since');
    const jobApplicationsElem = document.getElementById('job-applications');

    // Ensure elements are available in the DOM
    if (usernameElem) {
        usernameElem.textContent = username;
        usernameElem.classList.remove('shimmer');
    }
    if (emailElem) {
        emailElem.textContent = email;
        emailElem.classList.remove('shimmer');
    }
    if (accountTypeElem) {
        accountTypeElem.textContent = "Basic User";
        accountTypeElem.classList.remove('shimmer');
    }
    if (memberSinceElem) {
        const memberSince = userData.memberSince ? new Date(userData.memberSince).toLocaleDateString() : "N/A";
        memberSinceElem.textContent = memberSince;
        memberSinceElem.classList.remove('shimmer');
    }
    if (jobApplicationsElem) {
        const jobApplications = userData.jobApplications || "0";
        jobApplicationsElem.textContent = jobApplications;
        jobApplicationsElem.classList.remove('shimmer');
    }

    updateTotalDonations(email);
}

// Function to update total donations
function updateTotalDonations(email) {
    const donationsRef = firebase.database().ref('donations');
    let totalDonations = 0;

    donationsRef.once('value').then(snapshot => {
        snapshot.forEach(donationSnapshot => {
            const donationData = donationSnapshot.val();
            if (donationData.email === email) {
                totalDonations += parseFloat(donationData.amount); // Add to total donations
            }
        });

        const totalDonationsElem = document.getElementById('total-donations');
        if (totalDonationsElem) {
            totalDonationsElem.textContent = `₹${totalDonations.toFixed(2)}`;
            totalDonationsElem.classList.remove('shimmer');
        }
    }).catch(error => {
        console.error("Error fetching donations from Firebase:", error);
    });
}