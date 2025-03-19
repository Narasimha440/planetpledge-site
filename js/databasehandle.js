document.addEventListener('contextmenu', event => event.preventDefault());

const firebaseConfig = {
    apiKey: "AIzaSyDJ2ZZvAMpWKdiE2VWThjpF0q_jL892LXs",
    authDomain: "planetpledge-da56f.firebaseapp.com",
    databaseURL: "https://planetpledge-da56f-default-rtdb.firebaseio.com",
    projectId: "planetpledge-da56f",
    storageBucket: "planetpledge-da56f.appspot.com",
    messagingSenderId: "66399642910",
    appId: "1:66399642910:web:149ac94cd53dd532c3d50f"
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
