document.addEventListener('DOMContentLoaded', () => {
    const aqiList = document.getElementById('aqi-list');
    const map = L.map('map').setView([20, 0], 2); // Centered at the equator

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© PlanetPledge'
    }).addTo(map);

    // Your AirVisual API key
    const apiKey = 'AirVisual API key if needed'; // Replace with your AirVisual API key

    // Function to fetch AQI data for a specific city
    function fetchAQIData(city, country) {
        fetch(`http://api.airvisual.com/v2/city?city=${city}&country=${country}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const aqi = data.data.current.pollution.aqius; // AQI value
                    const aqiStatus = getAQIStatus(aqi);
                    const listItem = document.createElement('li');
                    listItem.textContent = `${city}, ${country}: AQI = ${aqi} (${aqiStatus})`;
                    aqiList.appendChild(listItem);

                    // Add marker with color based on AQI
                    const latLon = {
                        Delhi: [28.6139, 77.2090],
                        Mumbai: [19.0760, 72.8777],
                        'New York': [40.7128, -74.0060],
                        Tokyo: [35.6762, 139.6503],
                        London: [51.5074, -0.1278]
                    };

                    const coords = latLon[city];
                    if (coords) {
                        const markerColor = getAQIColor(aqi);
                        const marker = L.AwesomeMarkers.icon({
                            icon: 'cloud',
                            markerColor: markerColor
                        });
                        L.marker(coords, { icon: marker }).addTo(map)
                            .bindPopup(`${city}, ${country}: AQI = ${aqi} (${aqiStatus})`)
                            .openPopup();
                    }
                } else {
                    console.error('Error fetching AQI data:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching AQI data:', error);
                error.json().then(err => {
                    console.error('Detailed error message:', err);
                });
            });
    }

    // Function to get AQI status based on value
    function getAQIStatus(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }

    // Function to get marker color based on AQI value
    function getAQIColor(aqi) {
        if (aqi <= 50) return 'green';
        if (aqi <= 100) return 'yellow';
        if (aqi <= 150) return 'orange';
        if (aqi <= 200) return 'red';
        if (aqi <= 300) return 'purple';
        return 'darkred';
    }

    // Sample cities with their names and countries
    const cities = [
        { name: 'Delhi', country: 'India' },
        { name: 'Mumbai', country: 'India' },
        { name: 'New York', country: 'USA' },
        { name: 'Tokyo', country: 'Japan' },
        { name: 'London', country: 'UK' }
        // Add more cities as needed
    ];

    // Fetch AQI data for each city
    cities.forEach(city => {
        fetchAQIData(city.name, city.country);
    });
});
