const loginForm = document.querySelector('.login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;

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
    } else {
      const error = await response.json();
      alert('Error: ' + (error.message || 'Invalid credentials'));
    }
  } catch (err) {
    console.error('Request error:', err);
    alert('Error conecting to server.');
  }
});