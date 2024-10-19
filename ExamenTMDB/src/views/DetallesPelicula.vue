<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" @click="$router.push('/')">
          <!-- <img src="/logo.png" alt="Logo" class="logo" /> -->
        </a>
      </div>
    </nav>
    <div class="container mt-4">
      <h2>Detalles de la Película</h2>
      <div v-if="movie">
        <h3>{{ movie.title }}</h3>
        <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" class="img-fluid" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movie: null,
      cast: [],
      trailer: null,
      recommendations: [],
      keywords: []
    };
  },
  mounted() {
    const movieId = this.$route.params.movieId;
    if (movieId) {
      this.fetchMovieDetails(movieId);
    }
  },
  methods: {
    async fetchMovieDetails(movieId) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      try {
        const movieResponse = await this.$axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es`);
        this.movie = movieResponse.data;
      } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
      }
    }
  }
};
</script>

<style scoped>
</style>
