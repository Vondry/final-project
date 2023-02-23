
// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
//     funkce se typicky jmenuji compareTasks, (taskComparator) ...
export const sortingTasks = (a, b) => {
  if (a.completed !== b.completed) {
    return a.completed - b.completed
  }
  if (a.date !== b.date) {
    return a.date.localeCompare(b.date)
  }
  return a.task.localeCompare(b.task)
}