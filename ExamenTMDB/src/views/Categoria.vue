<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand btn-home" href="/">Atras</a>
      </div>
    </nav>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-3">
          <h4 class="text-center">Filtros</h4>
          <div class="filter-section">
            <h5>Ordenar por</h5>
            <select class="form-select" v-model="sortOption">
              <option selected>Seleccionar...</option>
              <option value="popularity">Popularidad</option>
              <option value="release_date">Fecha de Estreno</option>
              <option value="vote_average">Mejor Puntuación</option>
            </select>

            <h5 class="mt-3">Dónde se puede ver</h5>
            <ul class="list-group mb-3">
              <li class="list-group-item"><input type="checkbox"> Netflix</li>
              <li class="list-group-item"><input type="checkbox"> Amazon Prime</li>
              <li class="list-group-item"><input type="checkbox"> Disney+</li>
              <li class="list-group-item"><input type="checkbox"> HBO Max</li>
              <li class="list-group-item"><input type="checkbox"> Hulu</li>
            </ul>

            <h5 class="mt-3">Disponibilidad</h5>
            <div>
              <input type="checkbox" id="available" value="available">
              <label for="available">Disponible</label>
            </div>

            <h5 class="mt-3">Fechas de Estreno</h5>
            <input type="date" class="form-control mb-2">

            <h5 class="mt-3">Géneros</h5>
            <ul class="list-group">
              <li class="list-group-item"><input type="checkbox"> Acción</li>
              <li class="list-group-item"><input type="checkbox"> Comedia</li>
              <li class="list-group-item"><input type="checkbox"> Drama</li>
              <li class="list-group-item"><input type="checkbox"> Terror</li>
              <li class="list-group-item"><input type="checkbox"> Fantasía</li>
            </ul>

            <h5 class="mt-3">Certificación</h5>
            <select class="form-select mb-2">
              <option selected>Seleccionar...</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
            </select>

            <h5 class="mt-3">Idioma</h5>
            <select class="form-select mb-2">
              <option selected>Seleccionar...</option>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
            </select>

            <h5 class="mt-3">Puntuación de Usuarios</h5>
            <input type="range" class="form-range" min="0" max="10" step="1">

            <h5 class="mt-3">Votos Mínimos</h5>
            <input type="number" class="form-control mb-2" placeholder="Número de votos">

            <h5 class="mt-3">Duración</h5>
            <input type="number" class="form-control mb-2" placeholder="Minutos">

            <h5 class="mt-3">Palabras Clave</h5>
            <input type="text" class="form-control mb-2" placeholder="Buscar...">

            <button class="btn btn-primary mt-3" type="button" @click="filterMovies">Buscar</button>
          </div>
        </div>
        <div class="col-md-9">
          <h2>{{ categoryName }}</h2>
          <div class="movie-section" v-if="movies.length">
            <div class="movie-card" v-for="movie in movies" :key="movie.id">
              <a :href="'DetallesPelicula.html?movieId=' + movie.id">
                <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster">
                <p>{{ movie.title }}</p>
              </a>
            </div>
          </div>

          <h2></h2>
          <div class="movie-section" v-if="series.length">
            <div class="movie-card" v-for="serie in series" :key="serie.id">
              <a :href="'DetallesPelicula.html?movieId=' + serie.id">
                <img :src="'https://image.tmdb.org/t/p/w500' + serie.poster_path" :alt="serie.name" class="poster">
                <p>{{ serie.name }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      movies: [],
      series: [],
      categoryName: '',
      sortOption: ''
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    if (categoryId) {
      this.fetchMovies(categoryId);
      this.fetchSeries(categoryId);
      this.setCategoryName(categoryId);
    } else {
      console.error('No se proporcionó un ID de categoría');
    }
  },
  methods: {
    fetchMovies(categoryId) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      let endpoint = '';
      switch (categoryId) {
        case '28':
          endpoint = '/movie/popular';
          break;
        case '29':
          endpoint = '/movie/now_playing';
          break;
        case '30':
          endpoint = '/movie/upcoming';
          break;
        case '31':
          endpoint = '/movie/top_rated';
          break;
        default:
          break;
      }
      if (endpoint) {
        axios.get(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=es`)
          .then(response => {
            this.movies = response.data.results || [];
          })
          .catch(error => {
            console.error('Error al obtener datos de TMDb:', error);
          });
      }
    },
    fetchSeries(categoryId) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      let endpoint = '';
      switch (categoryId) {
        case '32':
          endpoint = '/tv/popular';
          break;
        case '33':
          endpoint = '/tv/on_the_air';
          break;
        case '34':
          endpoint = '/tv/top_rated';
          break;
        default:
          break;
      }
      if (endpoint) {
        axios.get(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=es`)
          .then(response => {
            this.series = response.data.results || [];
          })
          .catch(error => {
            console.error('Error al obtener datos de TMDb:', error);
          });
      }
    },
    setCategoryName(categoryId) {
      switch (categoryId) {
        case '28':
          this.categoryName = 'Películas Populares';
          break;
        case '29':
          this.categoryName = 'Películas en Cartelera';
          break;
        case '30':
          this.categoryName = 'Próximamente';
          break;
        case '31':
          this.categoryName = 'Mejor Puntuadas';
          break;
        case '32':
          this.categoryName = 'Series Populares';
          break;
        case '33':
          this.categoryName = 'Series en Emisión';
          break;
        case '34':
          this.categoryName = 'Series Mejor Puntuadas';
          break;
        default:
          this.categoryName = 'Categoría Desconocida';
          break;
      }
    },
    filterMovies() {










    }
  }
};
</script>

<style scoped>
.btn-home {
  background-color: #000000;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  padding: 5px 5px;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-home:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.movie-section {
  display: flex;
  flex-wrap: wrap;
}

.movie-card {
  margin: 10px;
  text-align: center;
}

.poster {
  width: 100%;
  max-width: 200px;
}
body {
  background-color: #413c3ce1;
  font-family: 'Arial', sans-serif;
}

.navbar {
  background-color: #343a40;
}

.col-md-3 {
  background-color: #000000;
  padding: 20px;
  border-radius: 5px;
}

.filter-section h5 {
  color: #fff;
  margin-top: 15px;
}

.form-select, .form-control {
  border-radius: 5px;
}

.list-group-item {
  background-color: transparent;
  color: #fff;
  border: none;
  padding: 10px;
  transition: background-color 0.3s, transform 0.3s;
}

.list-group-item:hover {
  background-color: #6c757d;
  cursor: pointer;
  transform: translateY(-2px);
}

.col-md-9 {
  padding: 20px;
}

.movie-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.movie-card {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  width: 150px;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.poster {
  width: 100%;
  height: auto;
  border-bottom: 4px solid #343a40;
}

.movie-card p {
  padding: 10px;
  text-align: center;
  color: #333;
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

h4 {
  color: #fff;
}

</style>
