import angular from 'angular'

let directives = angular.module('TodoApp.directives', [])

directives.run(() => {
  console.log('Running directives module')
})

directives.directive('task', require('./task'))
directives.directive('taskForm', require('./task-form'))

export default directives
