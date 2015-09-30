import angular from 'angular'

let services = angular.module('TodoApp.services', [])

services.run(() => {
  console.log('Running services module')
})

services.factory('TodoStore',require('./todo-store'))

export default services
