const projects = [
  { id: 1, project: 'zahrada' },
  { id: 2, project: 'TODO aplikace' },
  { id: 3, project: 'nákupy' }
]

// const PRIORITY_LOW = 1;
// const PRIORITY_MEIDUM = 2;
// const PRIORITY_HIGH = 2;

const PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
}

const tasks = [
  // TODO: projectid jmenne konvence, completed proc number?, priority - vyznam cisel?
  { id: 1, task: 'natřít plot', projectId: 1, completed: false, date: '2023-02-20', priority: PRIORITY.LOW },
  { id: 2, task: 'posekat trávu', projectid: 1, completed: 0, date: '2023-04-28', priority: PRIORITY.MEDIUM },
  { id: 3, task: 'ostříhat stromky', projectid: 1, completed: 1, date: '2023-03-01', priority: PRIORITY.HIGH },
  { id: 4, task: 'seznam projektů', projectid: 2, completed: true, date: '2023-05-02', priority: 2 },
  { id: 5, task: 'seznam úkolů', projectid: 2, completed: 1, date: '2023-01-21', priority: 2 },
  { id: 6, task: 'seznam osob', projectid: 2, completed: 0, date: '2023-02-28', priority: 1 },
  { id: 7, task: 'kafe', projectid: 3, completed: 0, date: '2023-01-15', priority: 1 },
  { id: 8, task: 'chleba', projectid: 3, completed: 0, date: '2023-01-15', priority: 1 },
  { id: 9, task: 'rohlík', projectid: 3, completed: 0, date: '2023-01-15', priority: 1 },
]

// TODO proc pouzivas obe syntaxe (function i arrow) pro zapis jedne funkce?
export const getProjects = () =>  // syntaxe function
  new Promise(resolve => {
    setTimeout(() => { // syntaxe arrow
      resolve(projects)
    }, 200)
  })


export const getTasks = function () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tasks)
    }, 200)
  })
}