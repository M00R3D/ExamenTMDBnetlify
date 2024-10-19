<template>
    <div class="login-container">
      <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" v-if="movies[0]">
            <img :src="'https://image.tmdb.org/t/p/w500' + movies[0].backdrop_path" class="d-block w-100" :alt="movies[0].title">
          </div>
          <div class="carousel-item" v-for="(movie, index) in movies.slice(1)" :key="movie.id">
            <img :src="'https://image.tmdb.org/t/p/w500' + movie.backdrop_path" class="d-block w-100" :alt="movie.title">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
  
      <h1>Iniciar Sesión</h1>
      <p>Inicia sesión con tu cuenta de TMDb para acceder a características adicionales.</p>
      <button class="btn btn-primary" @click="authenticateUser">Login con TMDb</button>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
  const movies = ref([]);
  const router = useRouter();
  const placeholderImg = 'https://via.placeholder.com/800x400';
  
  const fetchMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es`)
      .then(response => {
        movies.value = response.data.results.slice(0, 5);
      })
      .catch(error => {
        console.error('Error al obtener películas populares:', error);
      });
  };
  
  onMounted(() => {
    fetchMovies();
  });
  
  const authenticateUser = () => {
    axios.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
      .then(response => {
        const requestToken = response.data.request_token;
        const redirectUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${window.location.origin}/authenticated`;
        window.location.href = redirectUrl;
      })
      .catch(error => {
        console.error('Error al obtener el token de autenticación:', error);
      });
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
    background-color: #d297cd;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .carousel-inner {
    max-height: 500px;
  }
  
  h1 {
    margin-top: 20px;
  }
  
  p {
    margin-bottom: 20px;
  }
  
  .btn {
    width: 100%;
  }
  </style>
  