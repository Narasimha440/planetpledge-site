document.getElementById('proceedButton').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const email = document.getElementById('email').value;

    // Validation: Ensure email and amount are provided
    if (!email || !amount || amount <= 0) {
        alert('Please enter a valid email and donation amount.');
        return; // Stop execution if validation fails
    }

    // Generate QR Code using qrcode.js
    const upiId = "9963111874@axl"; // Your UPI ID
    const qrCodeUrl = `upi://pay?pa=${upiId}&pn=Planet%20Pledge&mc=YOUR_MERCHANT_CODE&tid=1234567890&am=${amount}&cu=INR&url=`;

    // Create the QR code element
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = '';
    new QRCode(qrCodeDiv, {
        text: qrCodeUrl,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });

    // Show the modal
    document.getElementById('qrModal').classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', function() {
    // Hide the modal
    document.getElementById('qrModal').classList.add('hidden');
});

document.getElementById('submitTransaction').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const amount = document.getElementById('amount').value;
    const transactionId = document.getElementById('transactionId').value;

    // Save donation to Firebase
    firebase.database().ref('donations').push({
        email: email,
        transactionId: transactionId,
        amount: amount,
        timestamp: new Date().toISOString()
    }).then(() => {
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('qrModal').classList.add('hidden'); // Close the modal on success
    }).catch((error) => {
        console.error('Error saving donation:', error);
    });
});
