<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="https://w7.pngwing.com/pngs/162/500/png-transparent-popcorn-popcorn-box-food.png" alt="Logo" class="logo" />
        </a>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <button class="btn btn-secondary mb-4" @click="goBack">Regresar</button>
      <h2>Detalles de la Temporada</h2>
      <div v-if="loading">
        <p>Cargando detalles de la temporada...</p>
      </div>
      <div v-else-if="error">
        <p>Error al cargar detalles: {{ error.message }}</p>
      </div>
      <div v-else>
        <div v-if="season">
          <h3>Temporada {{ season.season_number }}: {{ season.name }}</h3>
          <p><strong>Descripción:</strong> {{ season.overview }}</p>
          <p><strong>Fecha de emisión:</strong> {{ season.air_date }}</p>
          <p><strong>Episodios:</strong> {{ season.episodes.length }}</p>

          <h4>Episodios</h4>
          <div v-for="episode in season.episodes" :key="episode.id" class="mb-3">
            <h5>Episodio {{ episode.episode_number }}: {{ episode.name }}</h5>
            <p><strong>Descripción:</strong> {{ episode.overview }}</p>
            <p><strong>Fecha de emisión:</strong> {{ episode.air_date }}</p>
            <p><strong>Rating:</strong> {{ episode.vote_average }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const season = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const seriesId = route.query.seriesId;
  const seasonNumber = route.query.seasonNumber;
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
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}&language=es`);
    season.value = response.data;
  } catch (error) {
    throw new Error('Error al obtener los detalles de la temporada');
  }
};

const goBack = () => {
  router.go(-1);
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
</style>
