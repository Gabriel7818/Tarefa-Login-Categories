const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

sequelize.authenticate().then( function() {
    console.log('Conexão com o banco de dados realizada com sucesso!');
}).catch( function (err){
console.log(`Erro Conexão: ${err}`)
});

module.exports = sequelize;