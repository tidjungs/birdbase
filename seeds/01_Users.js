
exports.seed = function(knex, Promise) {

  var tableName = 'users';

  var rows = [
    {
      name: 'Waewprach Suthirawut',
      username: 'admin',
      password: 'admin',
      email: 'tidjungws@gmail.com',
      guid: 'f03ede7c-b121-4112-bcc7-130a3e87988c',
    },
  ];


  return knex(tableName)
    .del()
    .then(function () {
      return knex.insert(rows).into(tableName);
    });
};
