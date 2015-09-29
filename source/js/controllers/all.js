import angular from 'angular'

let controllers = angular.module('TodoApp.controllers', ['TodoApp.services'])

controllers.run(() => {
  console.log('Running Controllers module')
})

controllers.controller('TodoController', ($scope, TodoStore) => {
  $scope.tasks = TodoStore.getAll()
  $scope.pending_tasks = () => {
    return $scope.tasks.filter((task) => {
      return task.done === false
    })
  }

  TodoStore.onChange(() => {
    $scope.tasks = TodoStore.tasks
  })
})

export default controllers;
