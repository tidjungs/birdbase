import Hapi from 'hapi';
import Knex from '../config/knex';
import jwt from 'jsonwebtoken';
import routes from './routes'

const server = new Hapi.Server();

server.connection({
    port: 8080
});

server.register(require('hapi-auth-jwt'), err => {
  
  server.auth.strategy('token', 'jwt', {
    key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',
    verifyOptions: {
        algorithms: [ 'HS256' ], 
    }
  });

  routes.forEach(route => {
    console.log( `attaching ${route.method} ${route.path}` );
    server.route(route);
  });
});

server.start(err => {
  
  if (err) {
    console.error('Error was handled!');
    console.error(err);
  }

  console.log(`Server started at ${ server.info.uri }`);
});