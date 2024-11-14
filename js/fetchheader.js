function loadHeader() {
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('failed to load header.');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('header-placeholder').innerHTML = "<p>Failed to load header.</p>";
        });
}

loadHeader();