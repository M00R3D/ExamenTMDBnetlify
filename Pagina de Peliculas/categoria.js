const app = Vue.createApp({ 
  data() {
    return {
      categoryName: '',
      movies: [],
      series: [] // Array para las series
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    this.fetchMoviesByCategory(categoryId); // Llama para obtener películas
    this.fetchSeriesByCategory(categoryId); // Llama para obtener series
  },
  methods: {
    fetchMoviesByCategory(categoryId) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      let endpoint = '';
      switch (categoryId) {
        case '28': endpoint = '/movie/popular'; this.categoryName = 'Películas Populares'; break;
        case '29': endpoint = '/movie/now_playing'; this.categoryName = 'Películas en cartelera'; break;
        case '30': endpoint = '/movie/upcoming'; this.categoryName = 'Películas Próximamente'; break;
        case '31': endpoint = '/movie/top_rated'; this.categoryName = 'Películas Mejor Puntuadas'; break;
        default: endpoint = '/movie/popular'; this.categoryName = 'Películas Populares';
      }

      axios.get(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=es`)
        .then(response => {
          this.movies = response.data.results; // Guarda solo las películas
        })
        .catch(error => {
          console.error('Error al obtener los datos de películas:', error);
        });
    },
    fetchSeriesByCategory(categoryId) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      let endpoint = '/tv/popular'; // Cambia esto si quieres filtrar por categoría específica
      this.categoryName += ' y Series Populares'; // Actualiza el nombre de la categoría para las series

      axios.get(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=es`)
        .then(response => {
          this.series = response.data.results; // Guarda solo las series
        })
        .catch(error => {
          console.error('Error al obtener los datos de series:', error);
        });
    }
  }
});

app.mount('body');
