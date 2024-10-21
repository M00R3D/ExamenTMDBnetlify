<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="https://w7.pngwing.com/pngs/162/500/png-transparent-popcorn-popcorn-box-food.png" alt="Logo" class="logo" />
        </a>
      </div>
    </nav>

    <div class="container mt-4">
      <button class="btn btn-secondary mb-4" @click="goBack">Regresar a Detalles de la Serie</button>
      <h2>Detalles de la Temporada</h2>
      <div v-if="loading">
        <p>Cargando detalles...</p>
      </div>
      <div v-else-if="error">
        <p>Error al cargar detalles: {{ error.message }}</p>
      </div>
      <div v-else>
        <h3>{{ season.name }}</h3>
        <p><strong>Descripción:</strong> {{ season.overview }}</p>
        <h4 class="mt-4">Episodios</h4>
        <div class="row" v-if="episodes && episodes.length">
          <div class="col-md-4" v-for="episode in episodes" :key="episode.id">
            <div class="card">
              <img :src="'https://image.tmdb.org/t/p/w500' + episode.still_path" class="card-img-top" alt="Episode Image" />
              <div class="card-body">
                <h5 class="card-title">{{ episode.name }}</h5>
                <p><strong>Número:</strong> {{ episode.episode_number }}</p>
                <p><strong>Estreno:</strong> {{ episode.air_date }}</p>
                <p><strong>Descripción:</strong> {{ episode.overview }}</p>
                
                <button class="btn btn-link" @click="toggleEpisode(episode.id)">
                  {{ expandedEpisodes[episode.id] ? 'Ocultar Estrellas Invitadas' : 'Mostrar Estrellas Invitadas' }}
                </button>
                
                <div v-if="expandedEpisodes[episode.id]">
                  <h6>Estrellas Invitadas:</h6>
                  <ul>
                    <li v-for="guest in episode.guest_stars" :key="guest.id" @click="goToArtistDetails(guest.id)" style="cursor: pointer;">
                      {{ guest.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No se encontraron episodios.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const season = ref(null);
const episodes = ref([]);
const loading = ref(true);
const error = ref(null);
const expandedEpisodes = ref({});

const seriesId = route.query.seriesId;
const seasonNumber = route.query.seasonNumber;

onMounted(async () => {
  try {
    await fetchSeasonDetails(seriesId, seasonNumber);
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
});

const fetchSeasonDetails = async (seriesId, seasonNumber) => {
  const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
  try {
    const seasonResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}&language=es`);
    season.value = seasonResponse.data;
    episodes.value = seasonResponse.data.episodes;
  } catch (error) {
    throw new Error('Error al obtener los detalles de la temporada');
  }
};

const goBack = () => {
  router.push({ name: 'DetallesSeries', params: { seriesId } });
};

const toggleEpisode = (episodeId) => {
  expandedEpisodes.value[episodeId] = !expandedEpisodes.value[episodeId];
};

const goToArtistDetails = (artistId) => {
  router.push({ name: 'DetalleArtista', query: { artistId } });
};
</script>

<style scoped>
.navbar-custom {
  background-color: #2c3e50;
}
.navbar-custom a {
  color: #ecf0f1;
  margin-right: 20px;
}
.navbar-custom a:hover {
  color: #f39c12;
}
.logo {
  height: 40px;
}
.card {
  margin-bottom: 20px;
}
</style>
