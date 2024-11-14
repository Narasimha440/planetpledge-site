document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map');
    mapContainer.style.height = '600px';

    const map = L.map('map').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        minZoom: 5,
        attribution: '© PlanetPledge'
    }).addTo(map);

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const cityNames = [];
            const aqiValues = [];
            data.records.forEach(record => {
                const lat = parseFloat(record.latitude);
                const lon = parseFloat(record.longitude);
                const cityName = record.city;
                const stateName = record.state;
                const aqiValue = record.aqi_value;

                cityNames.push(`${cityName}, ${stateName}`);
                aqiValues.push(aqiValue);

                addMarker(lat, lon, cityName, stateName, aqiValue);
            });

            createAqiChart(cityNames, aqiValues);
        })
        .catch(error => console.error('Error loading AQI data:', error));

    function getMarkerColor(aqiValue) {
        if (aqiValue <= 50) return { color: 'green', status: 'Good 😀' }; // Good
        else if (aqiValue <= 100) return { color: 'yellow', status: 'Moderate 😐' }; // Moderate
        else if (aqiValue <= 150) return { color: 'orange', status: 'Unhealthy for Sensitive Groups 😷' }; // Unhealthy for Sensitive Groups
        else if (aqiValue <= 200) return { color: 'red', status: 'Unhealthy ⚠️' }; // Unhealthy
        else return { color: 'purple', status: 'Very Unhealthy 💔' }; // Very Unhealthy
    }

    function addMarker(lat, lon, cityName, stateName, aqiValue) {
        const { color, status } = getMarkerColor(aqiValue);

        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="marker" style="background-color:${color};">
                    <span class="aqi-value">${aqiValue}</span>
                </div>
            `,
            iconSize: [40, 40], // Size of the marker
            iconAnchor: [20, 40], // Anchor point of the marker
        });

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
        
        // Show the city, state, AQI value, and status in the popup
        marker.bindPopup(`${cityName}, ${stateName}<br>AQI: ${aqiValue}<br>Status: ${status}`);
    }

    function createAqiChart(labels, data) {
        const ctx = document.getElementById('aqiChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Air Quality Index',
                    data: data,
                    backgroundColor: 'rgba(255, 255, 102, 0.7)',
                    borderColor: 'rgba(255, 255, 102, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'white' }
                    },
                    x: {
                        ticks: { color: 'white' }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: 'white' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `AQI: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });

        ctx.canvas.parentNode.style.backgroundColor = '#333';
    }
});
