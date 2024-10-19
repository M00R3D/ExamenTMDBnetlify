<template>
    <div class="authenticating">
      <h1>Autenticando...</h1>
      <p>Por favor espera mientras procesamos tu autenticación.</p>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  
  const apiKey = '06524ff7325ce43f515a20c7b39d58a7';
  const router = useRouter();
  
  onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestToken = urlParams.get('request_token');

  if (requestToken) {
    axios.post(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}`, {
      request_token: requestToken
    })
    .then(response => {
      const sessionId = response.data.session_id;
      localStorage.setItem('sessionId', sessionId);

      axios.get(`https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`)
        .then(accountResponse => {
          const username = accountResponse.data.username;
          localStorage.setItem('username', username);
          router.push({ name: 'Home' }); 
        })
        .catch(error => {
          console.error('Error al obtener los detalles de la cuenta:', error);
        });
    })
    .catch(error => {
      console.error('Error al crear session_id:', error);
    });
  }
});

  </script>
  
  <style scoped>
  .authenticating {
    text-align: center;
    margin-top: 100px;
  }
  </style>
  