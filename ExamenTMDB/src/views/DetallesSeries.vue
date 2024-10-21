<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            <img src="https://w7.pngwing.com/pngs/162/500/png-transparent-popcorn-popcorn-box-food.png" alt="Logo" class="logo" />
          </a>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Películas
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/categoria?categoryId=28">Popular</a></li>
                  <li><a class="dropdown-item" href="/categoria?categoryId=29">En cartelera</a></li>
                  <li><a class="dropdown-item" href="/categoria?categoryId=30">Próximamente</a></li>
                  <li><a class="dropdown-item" href="/categoria?categoryId=31">Mejor puntuadas</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Series
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/categoria?categoryId=32">Popular</a></li>
                  <li><a class="dropdown-item" href="/categoria?categoryId=33">En emisión</a></li>
                  <li><a class="dropdown-item" href="/categoria?categoryId=34">Mejor puntuadas</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      <div class="container mt-4">
        <button class="btn btn-secondary mb-4" @click="goHome">Regresar a Home</button>
        <h2>Detalles de la Serie</h2>
        <div v-if="loading">
          <p>Cargando detalles...</p>
        </div>
        <div v-else-if="error">
          <p>Error al cargar detalles: {{ error.message }}</p>
        </div>
        <div v-else>
          <div v-if="series">
            <div class="row">
              <div class="col-md-4">
                <img :src="'https://image.tmdb.org/t/p/w500' + series.poster_path" :alt="series.name" class="poster img-fluid" />
              </div>
              <div class="col-md-8">
                <h3>{{ series.name }}</h3>
                <p><strong>Descripción:</strong> {{ series.overview }}</p>
                <p><strong>Categorías:</strong> 
                  <span v-for="(genre, index) in series.genres" :key="index">{{ genre.name }}<span v-if="index < series.genres.length - 1">, </span></span>
                </p>
                <p><strong>Rating:</strong> {{ series.vote_average }}</p>
              </div>
            </div>
  
            <h4 class="mt-4">Reparto</h4>
            <div class="row" v-if="cast && cast.length">
              <div class="col-md-3" v-for="actor in cast" :key="actor.id">
                <div class="card">
                  <img :src="'https://image.tmdb.org/t/p/w500' + actor.profile_path" :alt="actor.name" class="card-img-top" v-if="actor.profile_path" />
                  <div class="card-body">
                    <p class="card-text">{{ actor.name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>No se encontraron actores.</p>
            </div>
  
            <h4 class="mt-4">Palabras clave</h4>
            <ul v-if="keywords && keywords.length">
              <li v-for="keyword in keywords" :key="keyword.id">{{ keyword.name }}</li>
            </ul>
            <div v-else>
              <p>No se encontraron palabras clave.</p>
            </div>
  
            <h4 class="mt-4">Recomendaciones</h4>
            <div class="row" v-if="recommendations && recommendations.length">
              <div class="col-md-3" v-for="recommended in recommendations" :key="recommended.id" @click="loadSeriesDetails(recommended.id)" style="cursor: pointer;">
                <div class="card">
                  <img :src="'https://image.tmdb.org/t/p/w500' + recommended.poster_path" :alt="recommended.name" class="card-img-top" />
                  <div class="card-body">
                    <p class="card-text">{{ recommended.name }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>No se encontraron recomendaciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  const series = ref(null);
  const trailer = ref(null);
  const recommendations = ref([]);
  const cast = ref([]);
  const keywords = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const route = useRoute();
  
  onMounted(async () => {
    const seriesId = route.params.seriesId;
    try {
      await fetchSeriesDetails(seriesId);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  });
  
  const fetchSeriesDetails = async (seriesId) => {
    const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
    try {
      const seriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es`);
      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}&language=es`);
      const keywordsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/keywords?api_key=${apiKey}&language=es`);
      const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/recommendations?api_key=${apiKey}&language=es`);
      
      series.value = seriesResponse.data;
      cast.value = creditsResponse.data.cast;
      keywords.value = keywordsResponse.data.keywords;
      recommendations.value = recommendationsResponse.data.results;
    } catch (error) {
      console.error('Error al obtener los detalles de la serie:', error);
      throw new Error('Error al obtener los detalles de la serie');
    }
  };
  
  const goHome = () => {
    window.location.href = '/';
  };
  
  const loadSeriesDetails = (seriesId) => {
    window.location.href = `/DetallesSeries?seriesId=${seriesId}`;
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
  .poster {
    width: 200px;
    margin: 10px 0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  h2, h3 {
    color: #2c3e50;
  }
  .movie-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  </style>
  