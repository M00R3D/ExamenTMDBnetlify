<template>
    <div class="login-container">
      <h1>Iniciar Sesión</h1>
      <p>Inicia sesión con tu cuenta de TMDb para acceder a características adicionales.</p>
      <button class="btn btn-primary" @click="authenticateUser">Login con TMDb</button>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
  const router = useRouter();
  
  const authenticateUser = () => {
    axios.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`)
      .then(response => {
        const requestToken = response.data.request_token;
        const redirectUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${window.location.origin}/authenticated`;
        window.location.href = redirectUrl;
      })
      .catch(error => {
        console.error('Error al obtener el token de autenticación:', error);
      });
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  p {
    margin-bottom: 20px;
  }
  
  .btn {
    width: 100%;
  }
  </style>
  