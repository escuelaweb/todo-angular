
export default function() {
  return {
    restrict: 'E',
    scope: {
      task: '=task'
    },
    templateUrl: './views/task.html',
    link(scope, element, attrs) {

    },
  }
}
