import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DetallesPelicula from '../views/DetallesPelicula.vue';
import Categoria from '../views/Categoria.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movie/:movieId', name: 'MovieDetails', component: DetallesPelicula },
  { path: '/categoria', name: 'Categoria', component: Categoria }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
});

export default router;
