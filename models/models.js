var path = require('path');

//Postgres DATABASE_URL = postgres://user:password@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] ||null);
var user = (url[2] ||null);
var pwd = (url[3] ||null);
var protocol = (url[1] ||null);
var dialect = (url[1] ||null);
var port = (url[5] ||null);
var host = (url[4] ||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM

var Sequelize = require('sequelize');

//Usar BBDD SQLite:

//var sequelize = new Sequelize(null, null, null, {dialect:"sqlite", storage:"quiz.sqlite"});
var sequelize = new Sequelize(DB_name, user, pwd, 
	{ dialect:protocol, 
	  protocol:protocol, 
	  port:port, 
	  host:host, 
	  storage:storage, 
	  omitNull:true});

//Importar la definicion de la tabla Quiz en quiz.js

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la definicion de la tabla Comment en quiz.js

var Comment = sequelize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar definición de tabla Quiz
exports.Comment = Comment; //exportar definicion de tabla Comment.

sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0){ //la tabla se inicializa solo si está vacia.
			Quiz.create({
				pregunta:'Capital de Italia',
				respuesta:'Roma',
				tema: "humanidades"
			});
			Quiz.create({
				pregunta:'Capital de Portugal',
				respuesta:'Lisboa',
				tema: "humanidades"
			});
			Quiz.create({
				pregunta:'Ganador del Mundial de Futbol 2014',
				respuesta:'Alemania',
				tema: "ocio"

			});
			Quiz.create({
				pregunta:'Padre de la informática moderna',
				respuesta:'Alan Turing',
				tema: "tecnología"

			});
			Quiz.create({
				pregunta:'Año en el que termino la Segunda Guerra Mundial',
				respuesta:'1945',
				tema: "humanidades"

			}).then(function(){console.log('Base de datos inicializada')});
		}
	});
});