import { loadHeader } from "./loadComponent.js";
loadHeader();

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');
  const btnSignin = document.querySelector('#signin');
  const btnLogin = document.querySelector('#login');
  const body = document.querySelector('body');

  if (btnSignin) {
    btnSignin.addEventListener('click', () => {
      body.className = 'sign-in-js';
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      body.className = 'sign-up-js';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const login = document.getElementById('login-email')?.value || '';
      const password = document.getElementById('login-password')?.value || '';

      try {
        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ login, password })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          window.location.href = '/pages/home.html';
        } else {
          const error = await response.json();
          alert('Error: ' + (error.message || 'Invalid credentials'));
        }
      } catch (err) {
        console.error('Request error:', err);
        alert('Error connecting to server.');
      }
    });
  }
});