document.addEventListener('DOMContentLoaded', function() {
    
    let followCar = false; 
    const map = L.map('map', { 
        attributionControl: false, 
        zoomSnap: 0.1
    }).setView([53.0276, 27.5597], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markersGroup = L.markerClusterGroup({ 
        showCoverageOnHover: false, 
        disableClusteringAtZoom: 13, 
        spiderfyOnMaxZoom: true 
    });
    map.addLayer(markersGroup);

    // Данные без аудио и текстов
    const attractionsData = {
        "type": "FeatureCollection",
        "features": [
            { "type": "Feature", "properties": { "ID": 1, "NAME": "Часовня Святой Варвары", "IMAGES_DIR": "images/varvara_chapel", "IMAGES_COUNT": 4, "VIDEO": "video/varvara_chapel.mp4", "TYPE": "chapel" }, "geometry": { "type": "Point", "coordinates": [27.55419, 53.02608] } },
            { "type": "Feature", "properties": { "ID": 2, "NAME": "Памятник войнам-освободителям", "IMAGES_DIR": "images/monument_soldier", "IMAGES_COUNT": 3, "VIDEO": "video/monument_soldier.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55397, 53.02730] } },
            { "type": "Feature", "properties": { "ID": 3, "NAME": "Памятник Софии Слуцкой", "IMAGES_DIR": "images/monument_sofia", "IMAGES_COUNT": 5, "VIDEO": "video/monument_sofia.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55375, 53.02630] } },
            { "type": "Feature", "properties": { "ID": 4, "NAME": "Макет храма чудотворца", "IMAGES_DIR": "images/model_of_temple", "IMAGES_COUNT": 4, "VIDEO": "video/model_of_temple.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55400, 53.02659] } },
            { "type": "Feature", "properties": { "ID": 5, "NAME": "Дом Культуры", "IMAGES_DIR": "images/house_of_culture", "IMAGES_COUNT": 3, "VIDEO": "video/house_of_culture.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.55563, 53.02807] } },
            { "type": "Feature", "properties": { "ID": 6, "NAME": "Музей слуцкие пояса", "IMAGES_DIR": "images/museum_of_belts", "IMAGES_COUNT": 5, "VIDEO": "video/museum_of_belts.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.55531, 53.02443] } },
            { "type": "Feature", "properties": { "ID": 7, "NAME": "Гимназия №1", "IMAGES_DIR": "images/gymnasium", "IMAGES_COUNT": 4, "VIDEO": "video/gymnasium.mp4", "TYPE": "school" }, "geometry": { "type": "Point", "coordinates": [27.55914, 53.02604] } },
            { "type": "Feature", "properties": { "ID": 8, "NAME": "Памятник Анастасии Слуцкой", "IMAGES_DIR": "images/monument_anastasia", "IMAGES_COUNT": 3, "VIDEO": "video/monument_anastasia.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55522, 53.02768] } },
            { "type": "Feature", "properties": { "ID": 9, "NAME": "Краеведческий музей", "IMAGES_DIR": "images/local_history_museum", "IMAGES_COUNT": 3, "VIDEO": "video/local_history_museum.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.54690, 53.02375] } },
            { "type": "Feature", "properties": { "ID": 10, "NAME": "Бывшая почтовая станция", "IMAGES_DIR": "images/post_office", "IMAGES_COUNT": 5, "VIDEO": "video/post_office.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.54511, 53.02254] } },
            { "type": "Feature", "properties": { "ID": 11, "NAME": "Духовное училище", "IMAGES_DIR": "images/theological_school", "IMAGES_COUNT": 6, "VIDEO": "video/theological_school.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.54584, 53.01792] } },
            { "type": "Feature", "properties": { "ID": 12, "NAME": "Собор святого Михаила", "IMAGES_DIR": "images/michael_cathedral", "IMAGES_COUNT": 3, "VIDEO": "video/michael_cathedral.mp4", "TYPE": "chapel" }, "geometry": { "type": "Point", "coordinates": [27.57840, 53.03068] } }
        ]
    };

    let carMarker = null, routingControl = null, selectedPoints = [], animationPoints = [], stops = [];
    let currentIndex = 0, segmentProgress = 0, isPaused = false, isWaitingForClose = false, currentProps = null;
    let currentImgIdx = 1;

    function getPinColor(type) {
        switch(type) {
            case 'chapel': return 'pin-chapel'; case 'monument': return 'pin-monument';
            case 'museum': return 'pin-museum'; case 'school': return 'pin-school';
            default: return 'pin-monument';
        }
    }

    // Отрисовка точек
    L.geoJSON(attractionsData, {
        pointToLayer: (f, latlng) => {
            const colorClass = getPinColor(f.properties.TYPE);
            const iconHTML = `<div class="custom-pin ${colorClass}"><img src="img/icons/${f.properties.TYPE}.png" onerror="this.style.display='none'"></div>`;
            const icon = L.divIcon({ className: 'custom-div-icon', html: iconHTML, iconSize: [38, 38], iconAnchor: [19, 38] });
            const m = L.marker(latlng, { icon: icon });
            m.bindTooltip(f.properties.NAME, { direction: 'top', offset: [0, -35] });
            return m;
        },
        onEachFeature: (f, layer) => {
            const li = document.createElement('li');
            li.innerHTML = `<input type="checkbox" id="c${f.properties.ID}"><label for="c${f.properties.ID}"><span>${f.properties.NAME}</span></label>`;
            li.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) selectedPoints.push({ latlng: layer.getLatLng(), properties: f.properties });
                else selectedPoints = selectedPoints.filter(p => p.properties.ID !== f.properties.ID);
            });
            document.getElementById('route-list').appendChild(li);
            layer.on('click', () => window.openDetails(f.properties));
            markersGroup.addLayer(layer);
        }
    });

    document.getElementById('buildRoute').onclick = () => {
        if (selectedPoints.length < 2) return alert('Выберите хотя бы 2 объекта!');
        if (routingControl) map.removeControl(routingControl);
        
        // Скрываем меню на мобильном при построении маршрута
        document.getElementById('sidebar').classList.remove('active');

        routingControl = L.Routing.control({
            waypoints: selectedPoints.map(p => p.latlng),
            router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
            createMarker: () => null, addWaypoints: false, show: false,
            lineOptions: { styles: [{ color: '#440118', weight: 6, opacity: 0.7 }] }
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            animationPoints = e.routes[0].coordinates;
            stops = selectedPoints.map(p => ({ index: findClosestIndex(animationPoints, p.latlng), properties: p.properties })).sort((a, b) => a.index - b.index);
            currentIndex = 0; segmentProgress = 0; isWaitingForClose = true;
            window.openDetails(stops[0].properties);
            startCarAnimation();
        });
    };

    function startCarAnimation() {
        if (carMarker) map.removeLayer(carMarker);
        carMarker = L.marker([animationPoints[0].lat, animationPoints[0].lng], {
            icon: L.divIcon({ className: 'car-icon-container', html: `<img src="img/car.png" id="car-img" style="width:36px;height:36px;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3204/3204914.png'">`, iconSize: [36, 36], iconAnchor: [18, 18] })
        }).addTo(map);
        requestAnimationFrame(animateStep);
    }

    function animateStep() {
        if (!animationPoints.length || currentIndex >= animationPoints.length - 1) return;
        if (isPaused || isWaitingForClose) { requestAnimationFrame(animateStep); return; }

        const start = animationPoints[currentIndex], end = animationPoints[currentIndex + 1];
        segmentProgress += 0.05; 

        if (segmentProgress >= 1) {
            segmentProgress = 0; currentIndex++;
            const stop = stops.find(s => s.index === currentIndex);
            if (stop) { isWaitingForClose = true; window.openDetails(stop.properties); }
        }

        const lat = start.lat + (end.lat - start.lat) * segmentProgress;
        const lng = start.lng + (end.lng - start.lng) * segmentProgress;
        const pos = [lat, lng];
        
        carMarker.setLatLng(pos);
        if (followCar) map.panTo(pos, { animate: true, duration: 0.1 });
        
        requestAnimationFrame(animateStep);
    }

    function findClosestIndex(coords, latlng) {
        let minDist = Infinity, index = 0;
        coords.forEach((c, i) => { const d = Math.hypot(c.lat - latlng.lat, c.lng - latlng.lng); if (d < minDist) { minDist = d; index = i; } });
        return index;
    }

    // ОТКРЫТИЕ ПАНЕЛИ
    window.openDetails = function(props) {
        currentProps = props;
        document.getElementById('details-title').textContent = props.NAME;
        
        // Галерея
        const gallery = document.getElementById('details-gallery');
        gallery.innerHTML = '';
        for (let i = 1; i <= (props.IMAGES_COUNT || 0); i++) {
            const img = document.createElement('img');
            img.src = `${props.IMAGES_DIR}/${i}.jpg`;
            img.loading = "lazy";
            img.onclick = () => openImageZoom(i);
            gallery.appendChild(img);
        }

        // Видео
        const videoBox = document.getElementById('video-box');
        const videoEl = document.getElementById('details-video');
        if (props.VIDEO) {
            videoEl.src = props.VIDEO;
            videoBox.style.display = 'block';
        } else {
            videoEl.pause();
            videoBox.style.display = 'none';
        }

        document.getElementById('detailsPanel').classList.add('active');
    };

    // ФУНКЦИЯ ЗАКРЫТИЯ ПАНЕЛИ (Возобновляет маршрут)
    function closeDetailsPanel() {
        document.getElementById('details-video').pause();
        document.getElementById('detailsPanel').classList.remove('active'); 
        isWaitingForClose = false; // Разрешаем машине ехать дальше
    }

    // ЗУМ ФОТО
    function openImageZoom(idx) {
        currentImgIdx = idx;
        document.getElementById('fullImage').src = `${currentProps.IMAGES_DIR}/${currentImgIdx}.jpg`;
        document.getElementById('imageModal').style.display = 'flex';
    }

    window.changeImage = function(step) {
        currentImgIdx += step;
        if (currentImgIdx > currentProps.IMAGES_COUNT) currentImgIdx = 1;
        if (currentImgIdx < 1) currentImgIdx = currentProps.IMAGES_COUNT;
        document.getElementById('fullImage').src = `${currentProps.IMAGES_DIR}/${currentImgIdx}.jpg`;
    };

    document.addEventListener('keydown', (e) => {
        if (document.getElementById('imageModal').style.display === 'flex') {
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'Escape') document.getElementById('imageModal').style.display = 'none';
        }
    });

    // СОБЫТИЯ ИНТЕРФЕЙСА
    document.getElementById('pcSearch').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll('#route-list li').forEach(li => { li.style.display = li.textContent.toLowerCase().includes(val) ? 'flex' : 'none'; });
    };

    const sidebar = document.getElementById('sidebar');
    document.getElementById('toggleSidebar').onclick = () => sidebar.classList.add('active');
    document.getElementById('closeSidebar').onclick = () => sidebar.classList.remove('active');
    
    // Закрытие панели информации на крестик
    document.getElementById('closeDetailsBtn').onclick = closeDetailsPanel;
    
    document.getElementById('closeZoomBtn').onclick = () => document.getElementById('imageModal').style.display = 'none';
    document.getElementById('pauseCar').onclick = () => isPaused = !isPaused;
    document.getElementById('clearRoute').onclick = () => location.reload();
    document.getElementById('followCar').onclick = (e) => { 
        followCar = !followCar; 
        e.target.textContent = `🎥 Слежение: ${followCar ? 'ВКЛ' : 'ВЫКЛ'}`; 
    };

    // ДОПОЛНИТЕЛЬНО: Свайп вниз для мобильной версии, чтобы было удобно закрывать
    let touchStartY = 0;
    const detailsHeader = document.getElementById('detailsHeader');
    
    detailsHeader.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: true});

    detailsHeader.addEventListener('touchend', e => {
        const touchEndY = e.changedTouches[0].screenY;
        if (touchEndY - touchStartY > 50) { // Свайп вниз
            closeDetailsPanel();
        }
    }, {passive: true});
});