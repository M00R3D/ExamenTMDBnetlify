<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="https://w7.pngwing.com/pngs/162/500/png-transparent-popcorn-popcorn-box-food.png" alt="Logo" class="logo" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
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
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Series
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/categoria?categoryId=32">Popular</a></li>
                <li><a class="dropdown-item" href="/categoria?categoryId=33">En emisión</a></li>
                <li><a class="dropdown-item" href="/categoria?categoryId=34">Mejor puntuadas</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Cuenta</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Más</a>
            </li>
          </ul>
          <!-- <img src="buscar.png" alt="Buscar" class="search-icon ms-auto" /> -->
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <h2>Tendencias</h2>
      <div class="movie-section" v-if="movies.trending.length">
        <div v-for="movie in movies.trending" :key="movie.id" @click="goToDetails(movie.id)">
          <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
      <h2>Lo más popular</h2>
      <div class="movie-section" v-if="movies.popular.length">
        <div v-for="movie in movies.popular" :key="movie.id" @click="goToDetails(movie.id)">
          <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
      <h2>Ver gratis</h2>
      <div class="movie-section" v-if="movies.free.length">
        <div v-for="movie in movies.free" :key="movie.id" @click="goToDetails(movie.id)">
          <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
      <h2>Series o TV</h2>
      <div class="movie-section" v-if="movies.series.length">
        <div v-for="movie in movies.series" :key="movie.id" @click="goToDetails(movie.id)">
          <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const movies = ref({
  trending: [],
  popular: [],
  free: [],
  series: []
});

const router = useRouter();

onMounted(() => {
  fetchMovies('trending', '/trending/movie/day');
  fetchMovies('popular', '/movie/popular');
  fetchMovies('free', '/movie/top_rated');
  fetchMovies('series', '/tv/popular');
});

const fetchMovies = (category, endpoint) => {
  const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
  axios
    .get(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=es`)
    .then((response) => {
      movies.value[category] = response.data.results;
    })
    .catch((error) => {
      console.error('Error al obtener datos de TMDb:', error);
    });
};

const goToDetails = (movieId) => {
  router.push({ name: 'MovieDetails', params: { movieId } });
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
.search-icon {
  height: 20px;
  cursor: pointer;
}
.poster {
  width: 150px;
  margin: 10px;
  cursor: pointer; 
}
.movie-section {
  display: flex;
  overflow-x: scroll;
}
h2 {
  color: #2c3e50;
}
</style>
