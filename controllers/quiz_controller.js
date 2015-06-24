var models = require('../models/models.js');


//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
				
			}else{
				next(new Error('No existe quizId=' + quizId));
				
			}
		}).catch(function(error){
			next(error);
		});
}




 //GET /quizes

 exports.index = function(req,res){
 	/*models.Quiz.findAll().then(
 		function(quizes){
 			res.render('quizes/index', {quizes: quizes});
 		}
 	).catch(function(error){
 			next(error);
 	})*/

 	var search = "%";
	if(req.query.search != undefined){
		search = "%" + req.query.search.replace(/\u0020/g,"%") + "%";
		//search = search.trim().replace(/\s/g,"%");

		models.Quiz.findAll({where: ["lower(pregunta) like lower(?)", search], order: 'pregunta ASC'}).then(
			function(quizes){
				res.render('quizes/index.ejs',{quizes:quizes , errors: []});
			}
		).catch(function(error){
 			next(error);
 		});
	}
	else{
		models.Quiz.findAll().then(
			function(quizes){
				res.render('quizes/index.ejs', {quizes:quizes , errors: []});

			}
		).catch(function(error){
 			next(error);
 		});
	}

 };


//GET /quizes/question

exports.show = function(req,res){
	//res.render('quizes/question',{pregunta:'Capital de Italia'});

	//models.Quiz.findAll().then(function(quiz){
	//models.Quiz.find(req.params.quizId).then(function(quiz){

		//res.render('quizes/question',{ pregunta: quiz[0].pregunta})
		//res.render('quizes/show',{quiz:quiz});
	//})
		res.render('quizes/show.ejs', { quiz: req.quiz , errors: [] });
	//});
};

//GET /quizes/answer

exports.answer = function(req,res){
	/*if(req.query.respuesta === 'Roma'){
		res.render('quizes/answer',{respuesta:'Correcto'});
	}
	else{
		res.render('quizes/answer',{respuesta:'Incorrecto'});
	}*/

	//models.Quiz.findAll().then(function(quiz){
	//models.Quiz.find(req.params.quizId).then(function(quiz){

		//if(req.query.respuesta === quiz[0].respuesta){
		//if(req.query.respuesta === quiz.respuesta){
			//res.render('quizes/answer',{respuesta:'Correcto'});
		//}
		//else{
			//res.render('quizes/answer',{respuesta:'Incorrecto'});
		//}
		
	//})
		var resultado = 'Incorrecto';
		if( req.query.respuesta === req.quiz.respuesta ){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado , errors: []} );
	//});

};


//GET /quizes/new

exports.new = function(req,res){
	var quiz = models.Quiz.build(
		{pregunta:"Pregunta", respuesta:"Respuesta"}

	);

	res.render('quizes/new', {quiz:quiz , errors: []});
};

//POST /quizes/ create

exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err){
		if(err){
			res.render('/quizes/new', {quiz: quiz, errors: err.errors});
		}
		else{
			//guarda en DB los campos pregunta y respuesta de quiz.
			quiz.save({fields:["pregunta","respuesta"]}).then(function(){
			res.redirect('/quizes');
			 //Redireccion HTTP a lista de preguntas (URL relativo)
			})
		}

	});	
};

