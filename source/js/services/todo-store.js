import uuid from 'node-uuid'

function TodoStoreFactory($rootScope) {
  const TodoStore = {
    tasks: getLocal(),
    add(task) {
      this.tasks.push(Task(task))
      $rootScope.$broadcast('todo-change')
      return this.tasks
    },
    onChange(cb) {
      $rootScope.$on('todo-change', cb)
    },
    remove(task) {
      let index = findTaskIndex(task)
      this.tasks.splice(index, 1)
      $rootScope.$broadcast('todo-change')
      return this.tasks
    },
    update(task, newTask) {
      let taskindex = findTaskIndex(task)
      let result = Object.assign(this.tasks[taskindex], newTask)
      $rootScope.$broadcast('todo-change')
      return result
    },
    toggleStatus(task) {
      let taskindex = findTaskIndex(task)
      this.tasks[taskindex].status = !this.tasks[taskindex].status
      $rootScope.$broadcast('todo-change')
      return this.tasks[taskindex]
    },
    get(taskIndex) {
      return this.tasks[taskID]
    },
    getAll(sort = 'default') {
      return this.tasks.sort(function(a,b) {
        return a.done - b.done
      })
    },
    UNDONE: false,
    DONE: true,
    syncLocal: setLocal()
  }

  function setLocal() {
    $rootScope.$on('todo-change', function(e) {
      console.log('Register one change on TodoStore')
      window.localStorage.setItem('tasks', JSON.stringify(TodoStore.tasks))
    })
  }

  function getLocal() {
    var localTask = window.localStorage.getItem('tasks')
    if(typeof localTask === 'undefined' || localTask === '' || localTask === null) {
      return []
    } else {
      return JSON.parse(localTask)
    }
  }

  function findTaskIndex(task) {
    return TodoStore.tasks.findIndex(function(element) {
      return task.id === element.id
    })
  }

  function findTask(task) {
    return TodoStore.tasks.find(function(element) {
      return task.id === element.id
    })
  }

  function Task(title, done = TodoStore.UNDONE) {
    return { id: uuid.v1(), title: title, done: done}
  }

  window.TodoStore = TodoStore

  return TodoStore
}

export default TodoStoreFactory
