fetch('header-log.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load header-log.html');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading header:', error);
                document.getElementById('header-placeholder').innerHTML = "<p>Failed to load header.</p>";
            });