document.addEventListener('contextmenu', event => event.preventDefault());

const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    databaseURL: "YOUR-DATABASE-URL",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const enrollmentsRef = database.ref('enrollments');

document.addEventListener('DOMContentLoaded', function() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            const form = document.getElementById('job-enrollment-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const job = document.getElementById('job').value;
                const message = document.getElementById('msgContent').value;

                enrollmentsRef.push({
                    name: name,
                    email: email,
                    job: job,
                    message: message
                })
                .then(() => {
                    alert("Your job application has been successfully submitted!");
                    form.reset();

                    // Send a confirmation email
                    fetch('http://localhost:3000/send-email', { // Adjust URL if backend server is deployed
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: email,
                            subject: "PlanetPledge Job Application Confirmation",
                            text: `Dear ${name},\n\nThank you for applying to the ${job} position at PlanetPledge! We have received your application and will be in touch soon.\n\nBest regards,\nPlanetPledge Team`
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log("Confirmation email sent successfully!");
                        } else {
                            console.error("Failed to send confirmation email.");
                        }
                    })
                    .catch(error => console.error("Error sending email:", error));
                })
                .catch(error => {
                    alert("Error submitting application: " + error.message);
                });
            });
        });
});
