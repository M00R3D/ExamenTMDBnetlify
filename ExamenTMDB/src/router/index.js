import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DetallesPelicula from '../views/DetallesPelicula.vue';
import Categoria from '../views/Categoria.vue';
import Login from '../views/Login.vue';
import Authenticated from '../views/Authenticated.vue';

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
    path: '/detallespelicula', 
    name: 'DetallesPelicula', 
    component: DetallesPelicula 
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
  }
  
  ,
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


