// 1. Dados Simulados de Eventos (Nossa "API" por enquanto!)
const eventsData = [
    {
        id: 1,
        name: "Rock in Rio 2026 - Edição Especial",
        description: "Festival de música com grandes atrações nacionais e internacionais.",
        category: "musica",
        location: "Parque Olímpico, Barra da Tijuca",
        coords: [-22.99047, -43.41160], // Coordenadas do Parque Olímpico
        date: "25/09/2026",
        imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Rock+in+Rio"
    },
    {
        id: 2,
        name: "Exposição 'Arte Carioca'",
        description: "Exposição de artistas plásticos locais no CCBB.",
        category: "arte",
        location: "Centro Cultural Banco do Brasil (CCBB), Centro",
        coords: [-22.9038, -43.1788], // Coordenadas do CCBB
        date: "10/08/2026",
        imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Arte+Carioca"
    },
    {
        id: 3,
        name: "Maratona do Rio 2026",
        description: "Corrida de rua icônica, passando pela orla da Zona Sul.",
        category: "esporte",
        location: "Aterro do Flamengo (largada)",
        coords: [-22.9221, -43.1764], // Coordenadas do Aterro
        date: "01/06/2026",
        imageUrl: "https://via.placeholder.com/150/008000/FFFFFF?text=Maratona+RJ"
    },
    {
        id: 4,
        name: "Festival de Gastronomia da Lapa",
        description: "Food trucks e restaurantes com o melhor da culinária local.",
        category: "gastronomia",
        location: "Arcos da Lapa, Lapa",
        coords: [-22.9142, -43.1802], // Coordenadas dos Arcos da Lapa
        date: "18/07/2026",
        imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Lapa+Gastro"
    },
    {
        id: 5,
        name: "Roda de Samba na Pedra do Sal",
        description: "Tradicional roda de samba ao ar livre no berço do samba carioca.",
        category: "musica",
        location: "Pedra do Sal, Saúde",
        coords: [-22.8943, -43.1856], // Coordenadas da Pedra do Sal
        date: "Todas as segundas-feiras",
        imageUrl: "https://via.placeholder.com/150/800080/FFFFFF?text=Pedra+do+Sal"
    },
];

// 2. Inicialização do Mapa Leaflet
const map = L.map('map').setView([-22.9068, -43.1729], 12); // Centro do Rio, zoom 12

// Adiciona uma camada de mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = L.featureGroup().addTo(map); // Grupo para gerenciar os marcadores

// 3. Funções de Manipulação da Interface
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const applyFiltersButton = document.getElementById('applyFilters');
const eventsGrid = document.getElementById('events-grid');

/**
 * Renderiza os eventos na grade e adiciona marcadores no mapa.
 * @param {Array} eventsToRender - Lista de eventos filtrados para exibir.
 */
function renderEvents(eventsToRender) {
    eventsGrid.innerHTML = ''; // Limpa a grade de eventos
    markers.clearLayers(); // Limpa os marcadores existentes no mapa

    if (eventsToRender.length === 0) {
        eventsGrid.innerHTML = '<p>Nenhum evento encontrado com os filtros aplicados.</p>';
        return;
    }

    eventsToRender.forEach(event => {
        // Cria o cartão do evento
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.name}" style="width:100%; height:100px; object-fit:cover; border-radius: 4px; margin-bottom: 10px;">
            <h3>${event.name}</h3>
            <p><strong>Categoria:</strong> ${event.category}</p>
            <p><strong>Local:</strong> ${event.location}</p>
            <p><strong>Data:</strong> ${event.date}</p>
            <p>${event.description}</p>
        `;
        eventsGrid.appendChild(eventCard);

        // Adiciona marcador no mapa
        if (event.coords && event.coords.length === 2) {
            const marker = L.marker(event.coords)
                .bindPopup(`<b>${event.name}</b><br>${event.location}<br>${event.date}`);
            markers.addLayer(marker);
        }
    });

    if (eventsToRender.length > 0) {
        map.fitBounds(markers.getBounds(), { padding: [50, 50] }); // Ajusta o zoom do mapa para mostrar todos os marcadores
    }
}

/**
 * Filtra os eventos com base nos inputs do usuário.
 */
function filterEvents() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = eventsData.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText);

        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderEvents(filtered);
}

// 4. Event Listeners (O que acontece quando o usuário interage)
applyFiltersButton.addEventListener('click', filterEvents);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        filterEvents();
    }
});

// 5. Chamada inicial para renderizar todos os eventos quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    renderEvents(eventsData);
});