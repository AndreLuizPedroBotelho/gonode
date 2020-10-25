'use strict'

const Task = use('App/Models/Task')

class TaskController {
  async index ({ params }) {
    const tasks = await Task.query()
      .with('user', 'project', 'file')
      .where('project_id', params.projects_id)
      .fetch()

    return tasks
  }

  async store ({ request, params }) {
    const data = request.only([
      'title', 'description', 'user_id', 'due_date', 'file_id'
    ])

    const task = await Task.create({ ...data, project_id: params.projects_id })

    return task
  }

  async show ({ params, response }) {
    try {
      const task = await Task.findByOrFail({
        id: params.id
      })

      await task.load('user')
      await task.load('project')
      await task.load('file')

      return task
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Tarefa não encontrada' } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const data = request.only([
        'title', 'description', 'user_id', 'due_date', 'file_id'
      ])

      const task = await Task.findByOrFail({
        id: params.id
      })

      task.merge(data)

      await task.save()

      return task
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Tarefa não encontrada' } })
    }
  }

  async destroy ({ params, response }) {
    try {
      const task = await Task.findByOrFail({
        id: params.id
      })

      await task.delete()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Tarefa não encontrada' } })
    }
  }
}

module.exports = TaskController
