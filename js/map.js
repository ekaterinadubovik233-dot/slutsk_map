document.addEventListener('DOMContentLoaded', function() {
    let followCar = false; 
    const map = L.map('map', { attributionControl: false }).setView([53.0276, 27.5597], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markersGroup = L.markerClusterGroup({ showCoverageOnHover: false, disableClusteringAtZoom: 13 });
    map.addLayer(markersGroup);

    // Данные (сокращено для чистоты, используй свои полные данные)
    const attractionsData = {
        "type": "FeatureCollection",
        "features": [
            { "type": "Feature", "properties": { "ID": 1, "NAME": "Часовня Святой Варвары", "IMAGES_DIR": "images/varvara_chapel", "IMAGES_COUNT": 4, "VIDEO": "video/varvara_chapel.mp4", "TYPE": "chapel" }, "geometry": { "type": "Point", "coordinates": [27.55419, 53.02608] } },
            { "type": "Feature", "properties": { "ID": 2, "NAME": "Памятник войнам-освободителям", "IMAGES_DIR": "images/monument_soldier", "IMAGES_COUNT": 3, "VIDEO": "video/monument_soldier.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55397, 53.02730] } },
            { "type": "Feature", "properties": { "ID": 3, "NAME": "Памятник Софии Слуцкой", "IMAGES_DIR": "images/monument_sofia", "IMAGES_COUNT": 5, "VIDEO": "video/monument_sofia.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55375, 53.02630] } },
            { "type": "Feature", "properties": { "ID": 6, "NAME": "Музей слуцкие пояса", "IMAGES_DIR": "images/museum_of_belts", "IMAGES_COUNT": 5, "VIDEO": "video/museum_of_belts.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.55531, 53.02443] } },
            { "type": "Feature", "properties": { "ID": 7, "NAME": "Гимназия №1", "IMAGES_DIR": "images/gymnasium", "IMAGES_COUNT": 4, "VIDEO": "video/gymnasium.mp4", "TYPE": "school" }, "geometry": { "type": "Point", "coordinates": [27.55914, 53.02604] } }
            // Добавь остальные свои объекты сюда по аналогии...
        ]
    };

    let carMarker = null, routingControl = null, selectedPoints = [], animationPoints = [], stops = [];
    let currentIndex = 0, segmentProgress = 0, isPaused = false, isWaitingForClose = false, currentProps = null;
    let currentImgIdx = 1;

    function getPinColor(type) {
        switch(type) {
            case 'chapel': return 'pin-chapel'; 
            case 'monument': return 'pin-monument';
            case 'museum': return 'pin-museum'; 
            case 'school': return 'pin-school';
            default: return 'pin-monument';
        }
    }

    L.geoJSON(attractionsData, {
        pointToLayer: (f, latlng) => {
            const colorClass = getPinColor(f.properties.TYPE);
            const icon = L.divIcon({ 
                className: 'custom-div-icon', 
                html: `<div class="custom-pin ${colorClass}"><img src="img/icons/${f.properties.TYPE}.png"></div>`, 
                iconSize: [38, 38], iconAnchor: [19, 38] 
            });
            return L.marker(latlng, { icon: icon });
        },
        onEachFeature: (f, layer) => {
            const li = document.createElement('li');
            li.innerHTML = `<input type="checkbox" id="c${f.properties.ID}"><label for="c${f.properties.ID}"><span>${f.properties.NAME}</span></label>`;
            li.querySelector('input').onchange = (e) => {
                if (e.target.checked) selectedPoints.push({ latlng: layer.getLatLng(), properties: f.properties });
                else selectedPoints = selectedPoints.filter(p => p.properties.ID !== f.properties.ID);
            };
            document.getElementById('route-list').appendChild(li);
            layer.on('click', () => window.openDetails(f.properties));
            markersGroup.addLayer(layer);
        }
    });

    window.openDetails = function(props) {
        currentProps = props;
        document.getElementById('details-title').textContent = props.NAME;
        const gallery = document.getElementById('details-gallery');
        gallery.innerHTML = '';
        for (let i = 1; i <= (props.IMAGES_COUNT || 0); i++) {
            const img = document.createElement('img');
            img.src = `${props.IMAGES_DIR}/${i}.jpg`;
            img.onclick = () => openImageZoom(i);
            gallery.appendChild(img);
        }
        document.getElementById('details-video').src = props.VIDEO || "";
        document.getElementById('detailsPanel').classList.add('active');
    };

    function openImageZoom(idx) {
        currentImgIdx = idx;
        updateZoomImage();
        document.getElementById('imageModal').style.display = 'flex';
    }

    function updateZoomImage() {
        if (!currentProps) return;
        document.getElementById('fullImage').src = `${currentProps.IMAGES_DIR}/${currentImgIdx}.jpg`;
    }

    window.changeImage = function(step) {
        currentImgIdx += step;
        if (currentImgIdx > currentProps.IMAGES_COUNT) currentImgIdx = 1;
        if (currentImgIdx < 1) currentImgIdx = currentProps.IMAGES_COUNT;
        updateZoomImage();
    };

    // ГЛОБАЛЬНЫЕ КЛАВИШИ
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('imageModal');
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') window.changeImage(-1);
            if (e.key === 'ArrowRight') window.changeImage(1);
            if (e.key === 'Escape') modal.style.display = 'none';
        }
    });

    // ОБРАБОТЧИКИ КНОПОК
    document.getElementById('closeDetailsBtn').onclick = () => {
        document.getElementById('details-video').pause();
        document.getElementById('detailsPanel').classList.remove('active');
    };
    document.getElementById('closeZoomBtn').onclick = () => {
        document.getElementById('imageModal').style.display = 'none';
    };
    document.getElementById('navLeft').onclick = () => window.changeImage(-1);
    document.getElementById('navRight').onclick = () => window.changeImage(1);
    
    // Поиск
    document.getElementById('pcSearch').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll('#route-list li').forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(val) ? 'flex' : 'none';
        });
    };

    // Остальная логика анимации (buildRoute, animate и т.д.) остается прежней...
    // [Вставь сюда функции анимации из предыдущего кода, если они нужны]
});