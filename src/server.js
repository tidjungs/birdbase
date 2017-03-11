import Hapi from 'hapi';
import Knex from './knex';
import jwt from 'jsonwebtoken';

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
    console.log('sss');
    Knex('birds')
    .where({ isPublic: true })
    .select('name', 'species', 'picture_url')
    .then(results => {

      if(!results || results.length === 0) {
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

server.route({
  path: '/auth',
  method: 'POST',
  handler: (request, reply) => {

    const { username, password } = request.payload;

    Knex('users')
    .where({ username })
    .select('guid', 'password').then(( [user] ) => {

      if (!user) {
        reply({
          error: true,
          errMessage: 'the specified user was not found'
        });
        
        return;
      }

      if (user.password === password) {        
        const token = jwt.sign({
          username,
          scope: user.guid,
        }, 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {
          algorithm: 'HS256',
          expiresIn: '1h',
        });

        reply({
          token,
          scope: user.guid,
        });
      } else {
        reply( 'incorrect password' );
      }

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