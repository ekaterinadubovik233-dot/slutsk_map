document.addEventListener('DOMContentLoaded', () => {

const map = L.map('map').setView([53.0276,27.5597],14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
.addTo(map);

const markers = L.markerClusterGroup();
map.addLayer(markers);

let routing = null;
let selected = [];
let currentProps = null;
let currentImg = 1;

/* ДАННЫЕ */
const data = [
{
id:1,
name:"Часовня",
coords:[53.02608,27.55419],
images:"images/varvara",
count:3,
video:"video/test.mp4"
},
{
id:2,
name:"Памятник",
coords:[53.02730,27.55397],
images:"images/monument",
count:3,
video:"video/test.mp4"
}
];

/* МАРКЕРЫ */
data.forEach(obj => {

const marker = L.marker(obj.coords).addTo(markers);

marker.on('click', () => openDetails(obj));

const li = document.createElement('li');
li.innerHTML = `<input type="checkbox">${obj.name}`;

li.querySelector('input').onchange = (e)=>{
if(e.target.checked) selected.push(obj);
else selected = selected.filter(i=>i.id!==obj.id);
};

document.getElementById('route-list').appendChild(li);

});

/* ДЕТАЛИ */
function openDetails(obj){
currentProps = obj;

document.getElementById('details-title').textContent = obj.name;

const gallery = document.getElementById('details-gallery');
gallery.innerHTML = '';

for(let i=1;i<=obj.count;i++){
const img = document.createElement('img');
img.src = `${obj.images}/${i}.jpg`;
img.onclick = ()=>openZoom(i);
gallery.appendChild(img);
}

document.getElementById('details-video').src = obj.video;

document.getElementById('detailsPanel').classList.add('active');
}

/* ЗУМ */
function openZoom(i){
currentImg = i;
updateZoom();
document.getElementById('imageModal').style.display='flex';
}

function updateZoom(){
document.getElementById('fullImage').src =
`${currentProps.images}/${currentImg}.jpg`;
}

document.getElementById('navLeft').onclick = ()=>{
currentImg--;
if(currentImg<1) currentImg=currentProps.count;
updateZoom();
};

document.getElementById('navRight').onclick = ()=>{
currentImg++;
if(currentImg>currentProps.count) currentImg=1;
updateZoom();
};

/* ЗАКРЫТИЯ */
document.getElementById('closeDetailsBtn').onclick=()=>{
document.getElementById('detailsPanel').classList.remove('active');
};

document.getElementById('closeZoomBtn').onclick=()=>{
document.getElementById('imageModal').style.display='none';
};

/* ПОИСК */
document.getElementById('pcSearch').oninput = e=>{
const val = e.target.value.toLowerCase();

document.querySelectorAll('#route-list li').forEach(li=>{
li.style.display = li.textContent.toLowerCase().includes(val)
? 'block' : 'none';
});
};

/* МАРШРУТ */
document.getElementById('buildRoute').onclick = ()=>{

if(selected.length<2){
alert('Выберите минимум 2 точки');
return;
}

if(routing) map.removeControl(routing);

routing = L.Routing.control({
waypoints: selected.map(p=>L.latLng(p.coords))
}).addTo(map);

};

/* ОЧИСТКА */
document.getElementById('clearRoute').onclick = ()=>{
selected=[];
document.querySelectorAll('input').forEach(i=>i.checked=false);
if(routing) map.removeControl(routing);
};

});