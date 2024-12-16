
function parseCoordinates(input, defaultCoords = [0, 0], offsetMultiplier = 0.001) {
    const coordRegex = /^\s*(-?\d+(\.\d+)?)\s*[,\s]\s*(-?\d+(\.\d+)?)\s*$/;

    // Parse input using regex
    const match = input.match(coordRegex);
    if (match) {
        const [_, lat, , lon] = match.map(Number); // Extract and convert to numbers
        return [lon, lat];
    }

    // Generate random offset for default coordinates
    const getRandomOffset = () => (Math.random() * 2 - 1) * offsetMultiplier;

    return [
        defaultCoords[0] + getRandomOffset(),
        defaultCoords[1] + getRandomOffset()
    ];
}


function mapProcess(data) {
    console.log('💙 mapProcess: ', data)


    const radius = getRadius(map.getZoom());
    for (const data_item of data) {
        const { coords = '', title = '', about = '', img = '', link = '', kind = ''} = data_item;
        const spot = {
            coordinates: coords,
            title: title,
            about: about,
            thumbnail: img,
            link: link,
            kind: kind
        };

        const markerElem = document.createElement('div');
        markerElem.className = 'marker marker-interest';
        markerElem.style.width = `${radius}px`;
        markerElem.style.height = `${radius}px`;

        const markerPopupElem = document.createElement('div');
        markerPopupElem.className = 'popup';

        if (spot.kind.trim()) {
            markerElem.classList.add(...spot.kind.split(' '));
            markerPopupElem.classList.add(...spot.kind.split(' '));
        }

        if (spot.title) {
            const titleElem = document.createElement('div');
            titleElem.className = 'popup-title';
            if (isHTML(spot.title)) {
                titleElem.innerHTML = spot.title;
            } else {
                titleElem.appendChild(
                    Object.assign(document.createElement('h3'), {textContent: spot.title}));
            }
            markerPopupElem.appendChild(titleElem);
        }

        if (spot.thumbnail) {
            const thumbnailElem = document.createElement('div');
            thumbnailElem.className = 'popup-img-container';

            if (isHTML(spot.thumbnail)) {
                thumbnailElem.innerHTML = spot.thumbnail;
                markerElem.style.backgroundColor = 'white';
            } else {
                const parts = spot.thumbnail.split('.');

                const imgSmallPath = `${config.rootURL}${config.imgDirPath}/${parts[0]}-100px.${parts[1]}`;
                const imgBigPath = `${config.rootURL}${config.imgDirPath}/${parts[0]}-220px.${parts[1]}`;

                markerElem.style.backgroundImage = `url('${imgSmallPath}\')`;

                const imgElem = document.createElement('img');
                imgElem.loading='lazy';
                imgElem.alt='';
                imgElem.src = imgBigPath;

                thumbnailElem.appendChild(imgElem);
            }
            markerPopupElem.appendChild(thumbnailElem);
        }

        if (spot.about){
            const aboutElem = document.createElement('div');
            aboutElem.className = 'popup-about';
            if (isHTML(spot.about)) {
                aboutElem.innerHTML = spot.about;
            } else {
                aboutElem.appendChild(
                    Object.assign(document.createElement('p'), {textContent: spot.about}));
            }
            markerPopupElem.appendChild(aboutElem);
        }

        if (spot.link){
            const linkElem = document.createElement('div');
            linkElem.className = 'popup-link';

            if (isHTML(spot.link)) {
                linkElem.innerHTML = spot.link;
            } else {
                const aElem = Object.assign(document.createElement('a'), {
                    href: spot.link,
                    textContent: spot.link,
                    target: '_blank'});
                linkElem.appendChild(aElem);
            }
            markerPopupElem.appendChild(linkElem);
        }

        new mapboxgl.Marker(markerElem)
            .setLngLat(parseCoordinates(spot.coordinates, config.mapCenter, config.offsetForSpotNoCoords))
            .setPopup(new mapboxgl.Popup({offset: 50}).setHTML(markerPopupElem.outerHTML))
            .addTo(map);
    }
}

dataYamlPath = 'data.yaml';

console.log('💚 config.dataYamlPath: ', dataYamlPath);

fetch(dataYamlPath)
    .then(response => response.text())
    .then(jsyaml.load)
    .then(mapProcess)
    .catch(error => {
        console.error('Error processing the map data:', error);
    });
