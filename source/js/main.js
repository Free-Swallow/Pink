const header = document.querySelector('.header');
const togglerNavNode = header.querySelector('.header-nav__button-toggle');
const navListNode = header.querySelector('.header-nav__list');
const navContainerNode = header.querySelector('.header-nav__main-menu');
const mapNode = document.querySelector('.contact__map');
const DEFAULT_SCALE = 20;
const DEFAULT_COORDS = {
  lat: 59.938635,
  lng: 30.323118,
};

header.classList.remove('no-js');

// Main-Menu settings

function toggleMenu() {
  navListNode.classList.toggle('header-nav__list--open');
  navContainerNode.classList.toggle('header-nav__main-menu--open');
  togglerNavNode.classList.toggle('header-nav__button-toggle--open');
}

togglerNavNode.onclick = toggleMenu;

// Map

const map = L.map(mapNode)
  .setView(DEFAULT_COORDS, DEFAULT_SCALE);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon(
  {
    iconUrl: 'leaflet/images/map-marker.svg',
    iconSize: [36, 36],
    iconAnchor: [36, 18],
  },
);

const mainPin = L.marker(
  DEFAULT_COORDS,
  {
    draggable: false,
    icon: mainPinIcon,
  },
);

mainPin.addTo(map);
