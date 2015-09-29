
export default function(TodoStore) {
  return {
    restrict: 'E',
    templateUrl: '../views/task-form.html',
    link(scope, element, attrs) {

      scope.submit = (form) => {
        TodoStore.add(scope.taskTitle)
        init()
      }

      function init() {
        scope.taskTitle = ''
      }

      init()
    },
  }
}
