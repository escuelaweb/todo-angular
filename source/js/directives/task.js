
export default function() {
  return {
    restrict: 'E',
    scope: {
      task: '=task'
    },
    templateUrl: './views/task.html',
    link(scope, element, attrs) {
      scope.toggleID = () => {
        return `toggle-${scope.task.id}`
      }
      scope.markDone = () => {
        scope.task = TodoStore.toggleStatus(scope.task)
      }
      scope.removeTask = () => {
        TodoStore.remove(scope.task)
      }
    },
  }
}
