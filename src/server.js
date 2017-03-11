import Hapi from 'hapi';
import Knex from './knex';

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
});

// --------------
// Routes
// --------------

server.route({
  path: '/birds',
  method: 'GET',
  handler: (request, reply) => {
    
    Knex('birds')
    .select('name', 'species', 'picture_url')
    .where({ isPublic: true })
    .then( ( results ) => {

      if( !results || results.length === 0 ) {
        reply( {
          error: true,
          errMessage: 'no public bird found',
        });
      }

      reply({
        dataCount: results.length,
        data: results,
      });

    }).catch(err => { 
      reply('server-side error');
    });
  }
});

server.start(err => {
  
  if (err) {
    console.error('Error was handled!');
    console.error(err);
  }
  
  console.log(`Server started at ${ server.info.uri }`);
});