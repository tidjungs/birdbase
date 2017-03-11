import Knex from '../config/knex';
import jwt from 'jsonwebtoken';

const routes = [
  {
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
  },
  {
    path: '/birds',
    method: 'POST',
    config: {
      auth: {
        strategy: 'token',
      }
    } ,
    handler: (request, reply) => {
      const { bird } = request.payload;
    }
  },
  {
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
  }

];

export default routes;
