module.exports = {
  routes: [
    { 
      method: 'PUT',
      path: '/todo/modifytaskcompletion', 
      handler: 'todo.modifyTaskCompletion',
    },
  ],
};
