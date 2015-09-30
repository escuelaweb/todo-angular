import angular from 'angular'

let controllers = angular.module('TodoApp.controllers', ['TodoApp.services'])

controllers.run(() => {
  console.log('Running Controllers module')
})

controllers.controller('TodoController', require('./main'))

export default controllers;
