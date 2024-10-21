<template>
  <div class="login-page">
    <div class="carousel-container">
    
      <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
        <div class="carousel-inner">
          <div class="carousel-item active" v-if="movies[0]">
            <img :src="'https://image.tmdb.org/t/p/w1280' + movies[0].backdrop_path" class="d-block w-100" :alt="movies[0].title">
            <div class="carousel-caption">
              <h5>{{ movies[0].title }}</h5>
            </div>
          </div>
          <div class="carousel-item" v-for="(movie, index) in movies.slice(1)" :key="movie.id">
            <img :src="'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path" class="d-block w-100" :alt="movie.title">
            <div class="carousel-caption">
              <h5>{{ movie.title }}</h5>
            </div>
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
    </div>

    <div class="login-container">
      <h1>Iniciar Sesión</h1>
      <p>Inicia sesión con tu cuenta de TMDb para acceder a características adicionales.</p>
      <button class="btn btn-primary" @click="authenticateUser">Login con TMDb</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
const movies = ref([]);
const router = useRouter();

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

.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000428, #004e92);
  padding: 20px;
}


.carousel-container {
  width: 100%;
  max-width: 900px;
  margin-bottom: 50px;
}


.login-container {
  max-width: 450px;
  width: 100%;
  padding: 40px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.35);
}


h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #343a40;
}

p {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  margin-bottom: 30px;
  color: #555;
}


.btn {
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  border-radius: 30px;
  background-color: #007bff;
  border: none;
  color: #fff;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}


.carousel-inner {
  max-height: 500px;
  border-radius: 15px;
  overflow: hidden;
}

.carousel-item img {
  object-fit: cover;
  height: 100%;
}

.carousel-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #fff;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(100%);
}
</style>
