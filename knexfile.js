module.exports = {
  
  development: {
    
    migrations: { tableName: 'knex_migrations' },
    seeds: { tableName: './seeds' },
    
    client: 'mysql',
    connection: {
      
      host: '127.0.0.1',

      user: 'your_database_user',
      password: 'your_database_password',

      database: 'birdbase',
      charset: 'utf8',

    }
  
  }

};