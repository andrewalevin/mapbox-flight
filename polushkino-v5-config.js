
const config = {
    'centerMap': [36.7109, 55.6773],
    'zoomMap': 11,
    'styleMap': 'mapbox://styles/mapbox/satellite-streets-v12',
    'pitchMap': 80,
    'bearingMap': 240,
    'rangeFog': [-0.5, 4],
    'animationDuration': 50000,
    'token': 'pk.eyJ1IjoiYW5kcmV3bGV2aW4iLCJhIjoiY2t5ZXM5c3cyMWJxYjJvcGJycmw0dGlyeSJ9.9QfCmimkyYicpprraBc-XQ'
}

const getAltitude = tan;

function linear(x, high=900000, low=300000) {
    return high * (1 - x) + low;
}

function median(x, start=2000, end=2000) {
    return 0.5 * (start + end);
}


function atan(x, start=900000, end=300000) {
    return   0.5 * (end - start) * Math.atan(x - 0.5) / Math.atan(0.5) + 0.5 * (start + end);
}



function descend(x, high=900000, low=300000) {
    return high * (1 - x) + low;
}

function tan(x, high=900000, low=100000) {
    if (x<0.5)
        return -high * Math.tan(x - 0.5) + 0.5*high + low;
    else{
        return high * (1 - x) + low;
    }
}

function tanAndLinear(x, high=900000, low=100000) {
    if (x<0.5)
        return -high * Math.tan(x - 0.5) + 0.5*high + low;
    else{
        return high * (1 - x) + low;
    }
}

function logFunction(x, high=700000, low=200000) {
    x = x + 1
    if (x <= 0.5) {
        return high;
    } else if (x > 1 && x <= 1.5) {
        return 20000 * Math.log(1.5) / Math.log(x);
    } else if (x > 1.5 && x <= 2) {
        return 10000 * Math.log(2) / Math.log(x);
    } else {
        return low;
    }
}

function getAltitude1(x) {
    return -600000 * Math.log10(x+1) + 500000;
}


function addPopupCozySpot(map) {
    const item = {
        coordinates: [36.599121, 55.602060], // Use array format for easier manipulation
        title: 'Title',
        description: 'zvenigorod-biostation-220px.png',
        imagePath: 'file:///Users/andrewlevin/Desktop/maps/dev/zvenigorod-biostation-220px.png',
    };

    const radius = 50;

    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.style.width = `${radius}px`;
    markerElement.style.height = `${radius}px`;
    markerElement.style.backgroundImage = `url("${item.imagePath}")`;

    // Generate popup content
    const popupContent = `
        <div class="popup">
            <h3>${item.title}</h3>
            <p>
                <img loading="lazy" src="${item.imagePath}" alt="${item.title}" />
            </p>
        </div>
    `;

    // Add marker with popup to the map
    new mapboxgl.Marker(markerElement)
        .setLngLat(item.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)
        )
        .addTo(map);
}


function makeAtTheEnd() {
    const elementsToShow = [
        { id: 'gradient', className: 'show' },
        { id: 'explore-map', className: 'show' },
    ];

    elementsToShow.forEach(({ id, className }) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add(className);
        }
    });

    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.textContent = 'Restart';
        pauseButton.classList.add('button-light');
        pauseButton.addEventListener('click', () => window.location.reload());
    }
}
