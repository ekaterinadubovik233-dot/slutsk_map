document.addEventListener('DOMContentLoaded', () => {

    const map = L.map('map').setView([53.0276, 27.5597], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(map);

    const markers = L.markerClusterGroup();
    map.addLayer(markers);

    const data = [
        { id: 1, name: "Часовня", coords: [53.02608, 27.55419] },
        { id: 2, name: "Памятник", coords: [53.02730, 27.55397] }
    ];

    let selected = [];

    data.forEach(obj => {
        const marker = L.marker(obj.coords);

        marker.on('click', () => {
            document.getElementById('details-title').textContent = obj.name;
            document.getElementById('detailsPanel').classList.add('active');
        });

        markers.addLayer(marker);

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox">
            ${obj.name}
        `;

        li.querySelector('input').onchange = (e) => {
            if (e.target.checked) selected.push(obj);
            else selected = selected.filter(i => i.id !== obj.id);
        };

        document.getElementById('route-list').appendChild(li);
    });

    document.getElementById('closeDetailsBtn').onclick = () => {
        document.getElementById('detailsPanel').classList.remove('active');
    };

    document.getElementById('closeZoomBtn').onclick = () => {
        document.getElementById('imageModal').style.display = 'none';
    };

});