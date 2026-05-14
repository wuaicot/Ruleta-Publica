const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:8888',
  connections: 50,
  duration: 20,
  // Simulamos un comportamiento básico de socket cliente si fuera necesario
  // Dado que autocannon es principalmente HTTP, usaremos esto para validar latencia del servidor Express
});

autocannon.track(instance, { renderProgressBar: true });
