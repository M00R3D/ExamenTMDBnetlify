}<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="https://w7.pngwing.com/pngs/162/500/png-transparent-popcorn-popcorn-box-food.png" alt="Logo" class="logo" />
        </a>
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
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <button class="btn btn-secondary mb-4" @click="goHome">Regresar a Home</button>
      <h2>Detalles de la Película</h2>

      <div v-if="movie">
        <div class="row">
          <div class="col-md-4">
            <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster img-fluid">
          </div>
          <div class="col-md-8">
            <h3>{{ movie.title }}</h3>
            <p><strong>Descripción:</strong> {{ movie.overview }}</p>
            <p><strong>Categorías:</strong> 
              <span v-for="(genre, index) in movie.genres" :key="index">{{ genre.name }}<span v-if="index < movie.genres.length - 1">, </span></span>
            </p>
            <p><strong>Rating:</strong> {{ movie.vote_average }}</p>
          </div>
        </div>

        <h4 class="mt-4">Tráiler</h4>
        <div v-if="trailer">
          <iframe :src="'https://www.youtube.com/embed/' + trailer.key" allowfullscreen></iframe>
        </div>
        <div v-else>
          <p>No se encontró tráiler.</p>
        </div>

        <h4 class="mt-4">Reparto</h4>
        <div class="row" v-if="cast.length">
          <div class="col-md-3" v-for="actor in cast" :key="actor.id" @click="goToArtistDetails(actor.id)" style="cursor: pointer;">
            <div class="card">
              <img :src="'https://image.tmdb.org/t/p/w500' + actor.profile_path" :alt="actor.name" class="card-img-top" v-if="actor.profile_path">
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
        <ul v-if="keywords.length">
          <li v-for="keyword in keywords" :key="keyword.id">{{ keyword.name }}</li>
        </ul>
        <div v-else>
          <p>No se encontraron palabras clave.</p>
        </div>

        <h4 class="mt-4">Recomendaciones</h4>
        <div class="row" v-if="recommendations.length">
          <div class="col-md-3" v-for="recommended in recommendations" :key="recommended.id" @click="loadMovieDetails(recommended.id)" style="cursor: pointer;">
            <div class="card">
              <img :src="'https://image.tmdb.org/t/p/w500' + recommended.poster_path" :alt="recommended.title" class="card-img-top">
              <div class="card-body">
                <p class="card-text">{{ recommended.title }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No se encontraron recomendaciones.</p>
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

const movie = ref(null);
const trailer = ref(null);
const recommendations = ref([]);
const cast = ref([]);
const keywords = ref([]);

const route = useRoute();

onMounted(() => {
  const movieId = route.params.movieId;
  if (movieId) {
    fetchMovieDetails(movieId);
  } else {
    console.error('No se encontró el ID de la película en la URL.');
  }
});

const fetchMovieDetails = async (movieId) => {
  const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
  try {
    const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es`);
    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=es`);
    const keywordsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${apiKey}&language=es`);
    const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=es`);
    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=es`);

    movie.value = movieResponse.data;
    cast.value = creditsResponse.data.cast;
    keywords.value = keywordsResponse.data.keywords;
    trailer.value = videoResponse.data.results.find(video => video.type === 'Trailer');
    recommendations.value = recommendationsResponse.data.results;
  } catch (error) {
    console.error('Error al obtener los detalles de la película:', error);
  }
};

// Nueva función para cargar los detalles de la película seleccionada y desplazarse al principio
const loadMovieDetails = async (recommendedId) => {
  await fetchMovieDetails(recommendedId);
  window.scrollTo(0, 0); // Desplazarse al inicio de la página
};

const goHome = () => {
  window.location.href = '/';
};

const goToArtistDetails = (artistId) => {
  window.location.href = `/DetalleArtista?artistId=${artistId}`;
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
iframe {
  width: 100%;
  height: 315px;
  border-radius: 10px;
}
</style>
