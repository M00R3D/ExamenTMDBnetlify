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
        <h2>Detalles de la Serie</h2>
        <div v-if="series">
          <h3>{{ series.name }}</h3>
          <img :src="'https://image.tmdb.org/t/p/w500' + series.poster_path" :alt="series.name" class="img-fluid" />
          <p><strong>Descripción:</strong> {{ series.overview }}</p>
          <p><strong>Categorías:</strong> <span v-for="(genre, index) in series.genres" :key="index">{{ genre.name }}<span v-if="index < series.genres.length - 1">, </span></span></p>
          <p><strong>Rating:</strong> {{ series.vote_average }}</p>
  
          <h4>Reparto</h4>
          <ul>
            <li v-for="actor in cast" :key="actor.id">{{ actor.name }}</li>
          </ul>
  
          <h4>Palabras clave</h4>
          <ul>
            <li v-for="keyword in keywords" :key="keyword.id">{{ keyword.name }}</li>
          </ul>
  
          <h4>Trailer</h4>
          <div v-if="trailer">
            <iframe :src="'https://www.youtube.com/embed/' + trailer.key" width="560" height="315" frameborder="0" allowfullscreen></iframe>
          </div>
  
          <h4>Recomendaciones</h4>
          <div class="movie-section">
            <div v-for="recommended in recommendations" :key="recommended.id">
              <img :src="'https://image.tmdb.org/t/p/w500' + recommended.poster_path" :alt="recommended.name" class="poster" />
              <p>{{ recommended.name }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Cargando detalles...</p>
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
  
  const route = useRoute();
  
  onMounted(() => {
    const seriesId = route.params.seriesId;
    if (seriesId) {
      fetchSeriesDetails(seriesId);
    } else {
      console.error('No se encontró el ID de la serie en la URL.');
    }
  });
  
  const fetchSeriesDetails = async (seriesId) => {
    const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
    try {
      const seriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es`);
      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}&language=es`);
      const keywordsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/keywords?api_key=${apiKey}&language=es`);
      const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/recommendations?api_key=${apiKey}&language=es`);
      const videoResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}&language=es`);
      
      series.value = seriesResponse.data;
      cast.value = creditsResponse.data.cast;
      keywords.value = keywordsResponse.data.keywords;
      trailer.value = videoResponse.data.results.find(video => video.type === 'Trailer');
      recommendations.value = recommendationsResponse.data.results;
    } catch (error) {
      console.error('Error al obtener los detalles de la serie:', error);
    }
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
    width: 150px;
    margin: 10px;
  }
  .movie-section {
    display: flex;
    overflow-x: scroll;
  }
  h2 {
    color: #2c3e50;
  }
  </style>
  