const app = Vue.createApp({  
  data() {
    return {
      items: [], 
      shows: [], 
      categoryName: '', 
      order: '' 
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('categoryId');
    if (id) {
      this.loadItems(id);
      this.loadShows(id);
      this.assignSectionName(id);
    } else {
      console.error('No se proporcionó un ID de categoría');
    }
  },
  methods: {
    loadItems(id) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      let endpoint = '';
      switch (id) {
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
            this.items = response.data.results || []; 
            console.log('Items:', this.items); 
          })
          .catch(error => {
            console.error('Error al obtener datos de TMDb:', error);
          });
      }
    },
    loadShows(id) {
      const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
      let endpoint = '';
      switch (id) {
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
            this.shows = response.data.results || []; 
            console.log('Shows:', this.shows); 
          })
          .catch(error => {
            console.error('Error al obtener datos de TMDb:', error);
          });
      }
    },
    assignSectionName(id) {
      switch (id) {
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
    filterItems() {
    
      console.log('Filtrar elementos por:', this.order);
    }
  }
}).mount('#app');
