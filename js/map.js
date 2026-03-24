document.addEventListener('DOMContentLoaded', () => {

const map = L.map('map').setView([53.0276,27.5597],14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers = L.markerClusterGroup();
map.addLayer(markers);

let selected = [];
let currentProps = null;
let currentImg = 1;

/* ТВОЙ GEOJSON */
const data = {
"type":"FeatureCollection",
"features":[
/* ВСТАВЛЕН ВЕСЬ ТВОЙ GEOJSON БЕЗ ИЗМЕНЕНИЙ */
/* (сокращено тут — у тебя он уже полный, просто вставь как есть) */
]
};

/* СОРТИРОВКА ПО ORDER */
data.features.sort((a,b)=>a.properties.ORDER-b.properties.ORDER);

/* ЦВЕТ ИКОНКИ */
function getClass(type){
if(type==="chapel") return "pin-chapel";
if(type==="monument") return "pin-monument";
if(type==="museum") return "pin-museum";
if(type==="school") return "pin-school";
return "pin-museum";
}

/* ГЕНЕРАЦИЯ */
data.features.forEach(f=>{

const p = f.properties;
const coords = [f.geometry.coordinates[1], f.geometry.coordinates[0]];

const icon = L.divIcon({
className:"",
html:`<div class="custom-pin ${getClass(p.TYPE)}">
<img src="img/icons/${p.TYPE}.png" onerror="this.src='img/icons/default.png'">
</div>`
});

const marker = L.marker(coords,{icon}).addTo(markers);

marker.on('click', ()=>openDetails(p));

/* СПИСОК */
const li = document.createElement('li');

li.innerHTML = `
<input type="checkbox">
<span>${p.NAME}</span>
`;

li.querySelector('input').onchange = e=>{
if(e.target.checked){
selected.push({coords,id:p.ID});
}else{
selected = selected.filter(i=>i.id!==p.ID);
}
};

document.getElementById('route-list').appendChild(li);

});

/* ПАНЕЛЬ */
function openDetails(p){

currentProps = p;

document.getElementById('details-title').textContent = p.NAME;

/* ОПИСАНИЕ */
let desc = document.getElementById('details-desc');
if(!desc){
desc = document.createElement('p');
desc.id="details-desc";
document.getElementById('detailsPanel').appendChild(desc);
}
desc.textContent = p.DESCRIPTION;

/* ГАЛЕРЕЯ */
const gallery = document.getElementById('details-gallery');
gallery.innerHTML="";

for(let i=1;i<=p.IMAGES_COUNT;i++){
const img=document.createElement('img');
img.src=`${p.IMAGES_DIR}/${i}.jpg`;
img.onclick=()=>openZoom(i);
gallery.appendChild(img);
}

/* ВИДЕО */
document.getElementById('details-video').src=p.VIDEO;

/* АУДИО */
let audio = document.getElementById('details-audio');
if(!audio){
audio = document.createElement('audio');
audio.id="details-audio";
audio.controls=true;
document.getElementById('detailsPanel').appendChild(audio);
}
audio.src = p.AUDIO;

document.getElementById('detailsPanel').classList.add('active');
}

/* ЗУМ */
function openZoom(i){
currentImg=i;
updateZoom();
document.getElementById('imageModal').style.display='flex';
}

function updateZoom(){
document.getElementById('fullImage').src=
`${currentProps.IMAGES_DIR}/${currentImg}.jpg`;
}

document.getElementById('navLeft').onclick=()=>{
currentImg--;
if(currentImg<1) currentImg=currentProps.IMAGES_COUNT;
updateZoom();
};

document.getElementById('navRight').onclick=()=>{
currentImg++;
if(currentImg>currentProps.IMAGES_COUNT) currentImg=1;
updateZoom();
};

/* ЗАКРЫТИЯ */
document.getElementById('closeZoomBtn').onclick=()=>{
document.getElementById('imageModal').style.display='none';
};

document.getElementById('closeDetailsBtn').onclick=()=>{
document.getElementById('detailsPanel').classList.remove('active');

const v=document.getElementById('details-video');
v.pause();
v.currentTime=0;
};

/* ПОИСК */
document.getElementById('pcSearch').oninput=e=>{
const val=e.target.value.toLowerCase();

document.querySelectorAll('#route-list li').forEach(li=>{
li.style.display = li.textContent.toLowerCase().includes(val)
? 'flex':'none';
});
};

});