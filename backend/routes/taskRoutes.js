const { getUserFromSession } = require('../utils/session');
const {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
  shareTask,
} = require('../models/Task');
const { parse } = require('url');

function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(JSON.parse(body || '{}')));
  });
}

async function handleTasksAPI(req, res) {
  const user = await getUserFromSession(req);
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Unauthorized' }));
  }

  const urlParts = parse(req.url, true);
  const path = urlParts.pathname;
  const method = req.method;

  if (method === 'GET' && path === '/tasks') {
    const tasks = await getTasksByUser(user.email);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(tasks));
  }

  if (method === 'POST' && path === '/tasks') {
    const data = await getRequestBody(req);
    const task = {
      title: data.title,
      description: data.description || '',
      status: 'in-progress',
      priority: data.priority || 'normal',
      owner: user.email,
      sharedWith: [],
      createdAt: new Date(),
    };
    const result = await createTask(task);
    task._id = result.insertedId;
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(task));
  }

  if (method === 'PUT' && path.startsWith('/tasks/')) {
    const id = path.split('/')[2];
    const updates = await getRequestBody(req);
    await updateTask(id, updates);
    res.writeHead(204);
    return res.end();
  }

  if (method === 'DELETE' && path.startsWith('/tasks/')) {
    const id = path.split('/')[2];
    await deleteTask(id);
    res.writeHead(204);
    return res.end();
  }

  if (method === 'POST' && path === '/tasks/share') {
    const { taskId, shareWithEmail } = await getRequestBody(req);
    await shareTask(taskId, shareWithEmail);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ shared: true }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Task API route not found' }));
}

module.exports = { handleTasksAPI };