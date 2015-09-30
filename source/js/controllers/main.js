export default function($scope, TodoStore) {
  $scope.tasks = TodoStore.tasks
  $scope.pending_tasks = () => {
    return $scope.tasks.filter((task) => {
      return task.done === false
    })
  }
  TodoStore.onChange(() => {
    $scope.tasks = TodoStore.tasks
  })
}
