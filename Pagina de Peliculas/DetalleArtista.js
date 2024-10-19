const app = Vue.createApp({
    data() {
      return {
        artist: null,
        knownFor: [],
        filmography: []
      };
    },
    mounted() {
      this.loadArtistDetailsFromUrl();
      window.addEventListener('popstate', this.loadArtistDetailsFromUrl);
    },
    methods: {
      async loadArtistDetails(artistId) {
        const apiKey = '06524ff7325ce43f515a20c7b39d58a7'; // No reemplazar
        try {
          const artistResponse = await axios.get(`https://api.themoviedb.org/3/person/${artistId}?api_key=${apiKey}&language=es`);
          this.artist = artistResponse.data;
  
          const knownForResponse = await axios.get(`https://api.themoviedb.org/3/person/${artistId}/movie_credits?api_key=${apiKey}&language=es`);
          this.knownFor = knownForResponse.data.cast.slice(0, 6); // Limitar a 6 trabajos
  
          const filmographyResponse = await axios.get(`https://api.themoviedb.org/3/person/${artistId}/combined_credits?api_key=${apiKey}&language=es`);
          this.filmography = filmographyResponse.data.cast;
  
          window.scrollTo(0, 0);
  
          const newUrl = `DetallesArtista.html?artistId=${artistId}`;
          window.history.pushState({ artistId }, '', newUrl);
        } catch (error) {
          console.error('Error al obtener los detalles del artista:', error);
        }
      },
      loadArtistDetailsFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const artistId = params.get('artistId');
        if (artistId) {
          this.loadArtistDetails(artistId);
        } else {
          console.error('Faltan parámetros en la URL.');
        }
      },
      goHome() {
        window.location.href = 'home.html';
      },
      goToMovieDetails(movieId) {
        window.location.href = `DetallesPelicula.html?movieId=${movieId}`;
      }
    }
  }).mount('#app');
  