import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DetallesPelicula from '../views/DetallesPelicula.vue';
import DetalleArtista from '../views/DetalleArtista.vue';
import Categoria from '../views/Categoria.vue';
import Login from '../views/Login.vue';
import Authenticated from '../views/Authenticated.vue';
import DetallesSeries from '../views/DetallesSeries.vue';
import DetallesTemporada from '../views/DetallesTemporada.vue';

const isAuthenticated = () => {
  return !!localStorage.getItem('sessionId');
};

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/authenticated', 
    name: 'Authenticated', 
    component: Authenticated 
  },
  { 
    path: '/detalles/:movieId', 
    name: 'DetallesPelicula', 
    component: DetallesPelicula 
  },
  { 
    path: '/detallesserie/:seriesId', 
    name: 'DetallesSeries', 
    component: DetallesSeries 
  },
  {
    path: '/detallesTemporada/', 
    name: 'DetallesTemporada', 
    component: DetallesTemporada 
  },
  {
    path: '/categoria', 
    name: 'Categoria', 
    component: Categoria 
  },
  {
    path: '/detalleArtista',
    name: 'DetalleArtista',
    component: DetalleArtista 
  },
  { 
    path: '/', 
    name: 'Home', 
    component: Home, 
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next({ name: 'Login' }); 
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
});

export default router;
