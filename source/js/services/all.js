import angular from 'angular'
import uuid from 'node-uuid'

let services = angular.module('TodoApp.services', [])

services.run(() => {
  console.log('Running services module')
})

services.factory('TodoStore', ($rootScope) => {
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
      let oldTask = findTask(task)
      return Object.assign(oldTask, newTask)
    },
    toggleStatus(task) {
      let oldtask = findTask(task)
      let toggledStatus = (oldtask.done === TodoStore.DONE) ? TodoStore.UNDONE : TodoStore.DONE
      Object.assign(oldtask, {done: toggledStatus})
      $rootScope.$broadcast('todo-change')
      return oldtask
    },
    get(taskIndex) {
      return this.tasks[taskID]
    },
    getAll(sort = 'default') {
      this.tasks = this.tasks.sort(function(a,b) {
        return a.done - b.done
      }).slice(0)
      return this.tasks
    },
    UNDONE: false,
    DONE: true,
    syncLocal: setLocal()
  }

  function setLocal() {
    $rootScope.$on('todo-change', function(e) {
      console.log('Register one change on TodoStore')
      window.localStorage.setItem('tasks', JSON.stringify(TodoStore.getAll()))
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
})

export default services
