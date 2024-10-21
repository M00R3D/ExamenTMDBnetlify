<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand btn-home" href="/">Atrás</a>
      </div>
    </nav>
    
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-3">
          <h4 class="text-center">Filtros</h4>
          <div class="filter-section">
            <h5>Ordenar por</h5>
            <select class="form-select" v-model="sortOption" @change="sortContent">
              <option selected>Seleccionar...</option>
              <option value="popularity">Popularidad</option>
              <option value="vote_average">Mejor Puntuación</option>
            </select>

            <h5 class="mt-3">Dónde se puede ver</h5>
            <ul class="list-group mb-3">
              <li class="list-group-item" v-for="platform in platforms" :key="platform.id">
                <input type="checkbox" :value="platform.id" v-model="selectedPlatforms" @change="filterContent"> {{ platform.name }}
              </li>
            </ul>

            <h5 class="mt-3">Géneros</h5>
            <ul class="list-group">
              <li class="list-group-item" v-for="genre in genres" :key="genre.id">
                <input type="checkbox" :value="genre.id" v-model="selectedGenres" @change="filterContent"> {{ genre.name }}
              </li>
            </ul>

            <h5 class="mt-3">Puntuación de Usuarios</h5>
            <input type="range" class="form-range" min="0" max="10" step="1" v-model="userScore" @change="filterContent">

            <h5 class="mt-3">Votos Mínimos</h5>
            <input type="number" class="form-control mb-2" placeholder="Número de votos" v-model="minVotes" @change="filterContent">

            <h5 class="mt-3">Palabras Clave</h5>
            <input type="text" class="form-control mb-2" placeholder="Buscar..." v-model="keywords" @input="filterContent">

            <button class="btn btn-primary mt-3" type="button" @click="filterContent">Buscar</button>
          </div>
        </div>
        
        <div class="col-md-9">
          <h2>{{ categoryName }}</h2>
          <div class="movie-section" v-if="filteredMovies.length">
            <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id" @click="goToDetallesPelicula(movie.id)" style="cursor: pointer;">
              <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="poster">
              <p>{{ movie.title }}</p>
            </div>
          </div>
          <button v-if="moreMoviesAvailable" @click="loadMoreMovies" class="btn btn-primary mt-3">Ver Más Películas</button>

          <div class="movie-section" v-if="filteredSeries.length">
            <div class="movie-card" v-for="serie in filteredSeries" :key="serie.id" @click="goToDetallesSeries(serie.id)" style="cursor: pointer;">
              <img :src="'https://image.tmdb.org/t/p/w500' + serie.poster_path" :alt="serie.name" class="poster">
              <p>{{ serie.name }}</p>
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
      filteredMovies: [],
      filteredSeries: [],
      genres: [],
      platforms: [],
      categoryName: '',
      sortOption: '',
      selectedPlatforms: [],
      selectedGenres: [],
      userScore: 0,
      minVotes: null,
      keywords: '',
      limit: 10,
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    if (categoryId) {
      this.fetchGenres();
      this.fetchMovies(categoryId);
      this.fetchSeries(categoryId);
      this.setCategoryName(categoryId);
    } else {
      console.error('No se proporcionó un ID de categoría');
    }
  },
  computed: {
    moreMoviesAvailable() {
      return this.filteredMovies.length > this.limit;
    }
  },
  methods: {
    fetchGenres() {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es`)
        .then(response => {
          this.genres = response.data.genres;
        })
        .catch(error => {
          console.error('Error al obtener géneros:', error);
        });
    },
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
            this.filteredMovies = this.movies.slice(0, this.limit); 
            this.filterContent(); 
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
            this.filteredSeries = this.series.slice(0, this.limit); 
            this.filterContent();
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
          this.categoryName = 'Mejores Películas';
          break;
        case '32':
          this.categoryName = 'Series Populares';
          break;
        case '33':
          this.categoryName = 'Series en Emisión';
          break;
        case '34':
          this.categoryName = 'Mejores Series';
          break;
        default:
          this.categoryName = 'Categoría Desconocida';
          break;
      }
    },
    filterContent() {
      this.filterMovies();
      this.filterSeries();
    },
    filterMovies() {
      this.filteredMovies = this.movies.filter(movie => {
        const matchesGenres = this.selectedGenres.length
          ? movie.genre_ids.some(genreId => this.selectedGenres.includes(genreId))
          : true;

        const matchesPlatforms = this.selectedPlatforms.length
          ? movie.platforms && movie.platforms.some(platformId => this.selectedPlatforms.includes(platformId))
          : true;

        const matchesUserScore = movie.vote_average >= this.userScore;

        const matchesMinVotes = this.minVotes
          ? movie.vote_count >= this.minVotes
          : true;

        const matchesKeywords = this.keywords
          ? movie.title.toLowerCase().includes(this.keywords.toLowerCase())
          : true;

        return matchesGenres &&
               matchesPlatforms &&
               matchesUserScore &&
               matchesMinVotes &&
               matchesKeywords;
      }).slice(0, this.limit);
    },
    filterSeries() {
      this.filteredSeries = this.series.filter(serie => {
        const matchesGenres = this.selectedGenres.length
          ? serie.genre_ids.some(genreId => this.selectedGenres.includes(genreId))
          : true;

        const matchesPlatforms = this.selectedPlatforms.length
          ? serie.platforms && serie.platforms.some(platformId => this.selectedPlatforms.includes(platformId))
          : true;

        const matchesUserScore = serie.vote_average >= this.userScore;

        const matchesMinVotes = this.minVotes
          ? serie.vote_count >= this.minVotes
          : true;

        const matchesKeywords = this.keywords
          ? serie.name.toLowerCase().includes(this.keywords.toLowerCase())
          : true;

        return matchesGenres &&
               matchesPlatforms &&
               matchesUserScore &&
               matchesMinVotes &&
               matchesKeywords;
      }).slice(0, this.limit);
    },
    sortContent() {
      if (this.sortOption) {
        this.filteredMovies.sort((a, b) => b[this.sortOption] - a[this.sortOption]);
        this.filteredSeries.sort((a, b) => b[this.sortOption] - a[this.sortOption]);
      }
    },
    goToDetallesPelicula(id) {
      this.$router.push(`/detalles/${id}`);
    },
    goToDetallesSeries(id) {
      this.$router.push(`/detallesserie/${id}`);
    },
    loadMoreMovies() {
      this.limit += 10; 
      this.filterContent(); 
    },
  },
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
