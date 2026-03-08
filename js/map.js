document.addEventListener('DOMContentLoaded', function() {
    
    // 1. КАРТА
    const map = L.map('map', { attributionControl: false }).setView([53.0276, 27.5597], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markersGroup = L.markerClusterGroup({
        showCoverageOnHover: false, disableClusteringAtZoom: 13, spiderfyOnMaxZoom: true
    });
    map.addLayer(markersGroup);

    // 2. ДАННЫЕ
    const attractionsData = {
        "type": "FeatureCollection",
        "features": [
            { "type": "Feature", "properties": { "ID": 1, "NAME": "Часовня Святой Варвары", "DESCRIPTION": "Часовня Святой Варвары – одна из красивейших архитектурных достопримечательностей города Слуцка. Она находится у моста через реку Случь по улице М. Богдановича и привлекает внимание приезжих гостей и туристов. С часовни Святой Варвары открывается красивый вид на город и на соседний культурно-значимый объект Слуцка – памятник Софии Слуцкой.", "IMAGES_DIR": "images/varvara_chapel", "IMAGES_COUNT": 4, "AUDIO": "audio/varvara_chapel.mp3", "VIDEO": "video/varvara_chapel.mp4", "TYPE": "chapel" }, "geometry": { "type": "Point", "coordinates": [27.55419, 53.02608] } },
            { "type": "Feature", "properties": { "ID": 2, "NAME": "Памятник войнам-освободителям", "DESCRIPTION": "Впечатляющий мемориал изображает советского солдата — израненного молодого мужчину, который рвётся в последний бой. За его спиной развевается красное знамя. Скульптура выполнена из бронзы и помещена на тумбу из красного гранита. По окружности площади установлены доски с именами павших слутчан. От мемориала тянутся аллеи со стелами, которые выстраиваются в острый гребень.", "IMAGES_DIR": "images/monument_soldier", "IMAGES_COUNT": 3, "AUDIO": "audio/monument_soldier.mp3", "VIDEO": "video/monument_soldier.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55397, 53.02730] } },
            { "type": "Feature", "properties": { "ID": 3, "NAME": "Памятник Софии Слуцкой", "DESCRIPTION": "Памятник Софии Слуцкой был создан скульптором Михаилом Иньковым и архитектором Николаем Лукьянчиком. Памятник представляет собой отлитую из бронзы фигуру святой, а также высокую арку, находящуюся у княжны за спиной, состоящую из трех «лепестков». Важной деталью в композиции является жест левой руки Софии.", "IMAGES_DIR": "images/monument_sofia", "IMAGES_COUNT": 5, "AUDIO": "audio/monument_sofia.mp3", "VIDEO": "video/monument_sofia.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55375, 53.02630] } },
            { "type": "Feature", "properties": { "ID": 4, "NAME": "Макет храма чудотворца", "DESCRIPTION": "Интересный памятный знак был установлен в 2019 году. Это бронзовый макет древнего храма в честь Николая Чудотворца. Он был основан в XII столетии. В 1898 году его перестроили в камне, в неовизантийском стиле. Несмотря на реконструкцию, в храме сохранилась усыпальница князей Олельковичей и Радзивиллов. В 1934 г. храм был взорван.", "IMAGES_DIR": "images/model_of_temple", "IMAGES_COUNT": 4, "AUDIO": "audio/model_of_temple.mp3", "VIDEO": "video/model_of_temple.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55400, 53.02659] } },
            { "type": "Feature", "properties": { "ID": 5, "NAME": "Дом Культуры", "DESCRIPTION": "Дом культуры - здание в Слуцке, расположенное в центре города, в сквере по ул. Большая Горка. Строительство дома культуры началось в конце 1930-х гг. по немного увеличенному проекту Д. Ф. Фридмана, но к началу Великой Отечественной войны не успели открыть и достраивали уже к 1947 году. Памятник архитектуры неоклассицизма.", "IMAGES_DIR": "images/house_of_culture", "IMAGES_COUNT": 3, "AUDIO": "audio/house_of_culture.mp3", "VIDEO": "video/house_of_culture.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.55563, 53.02807] } },
            { "type": "Feature", "properties": { "ID": 6, "NAME": "Музей слуцкие пояса", "DESCRIPTION": "Музей истории Слуцких поясов хранит в себе великое национальное наследие и прекрасный образец декоративно-прикладного искусства, который стал не только историческим культурным символом, но и современным брендом Беларуси – слуцкие пояса. Эта реликвия являлась дорогим атрибутом мужского гардероба.", "IMAGES_DIR": "images/museum_of_belts", "IMAGES_COUNT": 5, "AUDIO": "audio/museum_of_belts.mp3", "VIDEO": "video/museum_of_belts.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.55531, 53.02443] } },
            { "type": "Feature", "properties": { "ID": 7, "NAME": "Гимназия №1", "DESCRIPTION": "Гимназия №1 знаменита не только в Слуцке, но и во всей Беларуси. Она была основана в 1617 году князем Янушем Радзивиллом, что делает её одним из старейших учебных заведений в Республике. В слуцкой гимназии обучались и преподавали многие знаменитые учёные, политики и деятели искусства.", "IMAGES_DIR": "images/gymnasium", "IMAGES_COUNT": 4, "AUDIO": "audio/gymnasium.mp3", "VIDEO": "video/gymnasium.mp4", "TYPE": "school" }, "geometry": { "type": "Point", "coordinates": [27.55914, 53.02604] } },
            { "type": "Feature", "properties": { "ID": 8, "NAME": "Памятник Анастасии Слуцкой", "DESCRIPTION": "Памятник Анастасии Слуцкой в Слуцке – это дань памяти мужеству и отваге этой хрупкой физически, но крепкой духом девушки. Перед нами она предстаёт, держа в руках длинный меч, что говорит о готовности защищать свои земли от набегов врагов. Торжественное открытие монумента приурочили к 900-летию Слуцка.", "IMAGES_DIR": "images/monument_anastasia", "IMAGES_COUNT": 3, "AUDIO": "audio/monument_anastasia.mp3", "VIDEO": "video/monument_anastasia.mp4", "TYPE": "monument" }, "geometry": { "type": "Point", "coordinates": [27.55522, 53.02768] } },
            { "type": "Feature", "properties": { "ID": 9, "NAME": "Краеведческий музей", "DESCRIPTION": "Слуцкий краеведческий музей расположен в Доме бывшего дворянского собрания, построенного в конце XVIII — начале XIX веков. Согласно источникам, первоначально оно было частным домом барона Фёдора Шталя (Сталя). На сегодняшний день музей имеет в наличии более 32 тыс. музейных предметов основного фонда.", "IMAGES_DIR": "images/local_history_museum", "IMAGES_COUNT": 3, "AUDIO": "audio/local_history_museum.mp3", "VIDEO": "video/local_history_museum.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.54690, 53.02375] } },
            { "type": "Feature", "properties": { "ID": 10, "NAME": "Бывшая почтовая станция", "DESCRIPTION": "Почтовая станция располагалась в великолепном здании начала XIX века. Его украшали белоснежные колонны, каменные наличники и карнизы. Внутри были просторные, светлые помещения с высокими потолками. Почтовая станция пережила революцию, Гражданскую и Великую Отечественную войны.", "IMAGES_DIR": "images/post_office", "IMAGES_COUNT": 5, "AUDIO": "audio/post_office.mp3", "VIDEO": "video/post_office.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.54511, 53.02254] } },
            { "type": "Feature", "properties": { "ID": 11, "NAME": "Духовное училище", "DESCRIPTION": "Духовное училище было построено в XIX веке. Это двухэтажное каменное здание в стиле классицизма. Из подлинных элементов декора сохранились строгое обрамление окон, угловые пилястры, межэтажный пояс и фронтоны. В настоящее время здание занимает медицинский колледж.", "IMAGES_DIR": "images/theological_school", "IMAGES_COUNT": 6, "AUDIO": "audio/theological_school.mp3", "VIDEO": "video/theological_school.mp4", "TYPE": "museum" }, "geometry": { "type": "Point", "coordinates": [27.54584, 53.01792] } },
            { "type": "Feature", "properties": { "ID": 12, "NAME": "Собор святого Михаила", "DESCRIPTION": "Церковь во имя Архистратига Михаила — единственное сохранившееся здание из многочисленных слуцких святынь и единственный дошедший до нас пример Слуцкой школы полесского деревянного церковного зодчества XVIII века, не имеющий прямых аналогов в Беларуси. Здание было двухсрубным, неокрашенным.", "IMAGES_DIR": "images/michael_cathedral", "IMAGES_COUNT": 3, "AUDIO": "audio/michael_cathedral.mp3", "VIDEO": "video/michael_cathedral.mp4", "TYPE": "chapel" }, "geometry": { "type": "Point", "coordinates": [27.57840, 53.03068] } }
        ]
    };

    let carMarker = null, routingControl = null, selectedPoints = [], animationPoints = [], stops = [];
    let currentIndex = 0, segmentProgress = 0, isPaused = false, followCar = true, isWaitingForClose = false, currentProps = null;
    let currentImgIdx = 1, lastPanTime = 0;

    function getPinColor(type) {
        switch(type) {
            case 'chapel': return 'pin-chapel'; case 'monument': return 'pin-monument';
            case 'museum': return 'pin-museum'; case 'school': return 'pin-school';
            default: return 'pin-monument';
        }
    }

    // Рендер объектов
    L.geoJSON(attractionsData, {
        pointToLayer: (f, latlng) => {
            const colorClass = getPinColor(f.properties.TYPE);
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="custom-pin ${colorClass}"><img src="img/icons/${f.properties.TYPE}.png"></div>`,
                iconSize: [36, 36], iconAnchor: [18, 36]
            });
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

    // Маршрут
    document.getElementById('buildRoute').onclick = () => {
        if (selectedPoints.length < 2) return alert('Выберите хотя бы 2 объекта!');
        if (routingControl) map.removeControl(routingControl);
        if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('active');

        routingControl = L.Routing.control({
            waypoints: selectedPoints.map(p => p.latlng),
            router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
            createMarker: () => null, show: false, addWaypoints: false,
            lineOptions: { styles: [{ color: '#440118', weight: 6, opacity: 0.7 }] }
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            animationPoints = e.routes[0].coordinates;
            stops = selectedPoints.map(p => ({ 
                index: findClosestIndex(animationPoints, p.latlng), 
                properties: p.properties 
            })).sort((a, b) => a.index - b.index);
            
            currentIndex = 0; segmentProgress = 0; isWaitingForClose = true;
            window.openDetails(stops[0].properties);
            startCarAnimation();
        });
    };

    function startCarAnimation() {
        if (carMarker) map.removeLayer(carMarker);
        carMarker = L.marker([animationPoints[0].lat, animationPoints[0].lng], {
            icon: L.divIcon({ 
                className: 'car-icon-container', 
                html: `<img src="img/car.png" id="car-img" style="width:36px;height:36px;">`, 
                iconSize: [36, 36], iconAnchor: [18, 18] 
            })
        }).addTo(map);
        animate();
    }

    function animate(time) {
        if (!animationPoints.length || currentIndex >= animationPoints.length - 1) return;
        if (isPaused || isWaitingForClose) { requestAnimationFrame(animate); return; }

        const start = animationPoints[currentIndex], end = animationPoints[currentIndex + 1];
        segmentProgress += 0.07; 

        if (segmentProgress >= 1) {
            segmentProgress = 0; currentIndex++;
            const stop = stops.find(s => s.index === currentIndex);
            if (stop) { isWaitingForClose = true; window.openDetails(stop.properties); }
        }

        const lat = start.lat + (end.lat - start.lat) * segmentProgress;
        const lng = start.lng + (end.lng - start.lng) * segmentProgress;
        const pos = [lat, lng];
        if (carMarker) carMarker.setLatLng(pos);

        if (followCar && time - lastPanTime > 40) {
            map.panTo(pos, { animate: false });
            lastPanTime = time;
        }
        requestAnimationFrame(animate);
    }

    function findClosestIndex(coords, latlng) {
        let minDist = Infinity, index = 0;
        coords.forEach((c, i) => { const d = Math.hypot(c.lat - latlng.lat, c.lng - latlng.lng); if (d < minDist) { minDist = d; index = i; } });
        return index;
    }

    window.openDetails = function(props) {
        currentProps = props;
        document.getElementById('details-title').textContent = props.NAME;
        document.getElementById('details-description').textContent = props.DESCRIPTION;
        const gallery = document.getElementById('details-gallery');
        gallery.innerHTML = '';
        for (let i = 1; i <= (props.IMAGES_COUNT || 0); i++) {
            const img = document.createElement('img');
            img.src = `${props.IMAGES_DIR}/${i}.jpg`;
            img.onclick = () => openImageZoom(i);
            gallery.appendChild(img);
        }
        document.getElementById('details-audio').src = props.AUDIO || '';
        document.getElementById('detailsPanel').classList.add('active');
    };

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

    function filterList(searchValue) {
        const val = searchValue.toLowerCase();
        document.querySelectorAll('#route-list li').forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(val) ? 'flex' : 'none';
        });
    }

    document.getElementById('pcSearch').oninput = (e) => filterList(e.target.value);
    document.getElementById('mobileSearch').oninput = (e) => filterList(e.target.value);
    document.getElementById('closeDetailsBtn').onclick = () => {
        document.getElementById('details-audio').pause();
        document.getElementById('detailsPanel').classList.remove('active');
        isWaitingForClose = false;
    };
    document.getElementById('openVideoBtn').onclick = () => {
        const v = document.getElementById('details-video');
        v.src = currentProps.VIDEO;
        document.getElementById('video-modal-title').textContent = currentProps.NAME;
        document.getElementById('videoModal').style.display = 'block';
    };
    document.getElementById('closeVideoBtn').onclick = () => {
        document.getElementById('details-video').pause();
        document.getElementById('videoModal').style.display = 'none';
    };
    document.getElementById('toggleSidebar').onclick = () => document.getElementById('sidebar').classList.add('active');
    document.getElementById('closeSidebar').onclick = () => document.getElementById('sidebar').classList.remove('active');
    document.getElementById('closeZoomBtn').onclick = () => document.getElementById('imageModal').style.display = 'none';
    document.getElementById('pauseCar').onclick = () => isPaused = !isPaused;
    document.getElementById('clearRoute').onclick = () => location.reload();
    document.getElementById('followCar').onclick = (e) => { 
        followCar = !followCar; e.target.textContent = `🎥 Слежение: ${followCar ? 'ВКЛ' : 'ВЫКЛ'}`; 
    };
});