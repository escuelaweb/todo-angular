import angular from 'angular'
import services from './services/all'
import controllers from './controllers/all'
import directives from './directives/all'
import partials from './partials/all'
// Se define un nuevo modulo de angular, para definir el modulo
// el mismo debe tener un segundo parametro con dependencias, en caso
// de no tener dependencias debe pasarse un array vacio.
// Esto debido a que el .module(params1, params2) con dos parametros
// es el set crear un nuevo modulo y con un solo parametro es un get
angular.module('TodoApp', ['TodoApp.directives','TodoApp.controllers', 'PartialsPrecompile'])

// El metodo run de un modulo, nos permite ejecutar codigo al momento que se
// monta el Angular por medio de la directiva ng-app
angular.module('TodoApp').run(function() {
  console.log('Running Angular with browserify')
})
