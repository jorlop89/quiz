var express = require('express');
var router = express.Router();

//var quizController = require('../controllers/quiz_controller');
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //Autoload :quizId
router.param('commentId', commentController.load); //Autoload :commentId

//Definicion de rutas de session
router.get('/login', sessionController.new);     //formulario login
router.post('/login', sessionController.create);  //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión

//Definicion de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

//Definicion de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

router.get('/quizes?search=texto_a_buscar',quizController.index);

// Definición de ruta para las estadísticas
router.get('/quizes/statistics', statisticsController.calculate, statisticsController.show);


//Creación de la petición al enlace 'author'
router.get('/author', function (req, res) {
 res.render('author', { errors: []});
});

module.exports = router;
