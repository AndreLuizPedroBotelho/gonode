'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index ({ request, response, auth }) {
    const { page } = request.get()

    const projects = await Project.query()
      .with('user')
      .where('user_id', auth.user.id)
      .paginate(page)

    return projects
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'description'])

    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  async show ({ params, request, response, auth }) {
    try {
      const project = await Project.findByOrFail({
        user_id: auth.user.id,
        id: params.id
      })

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Projeto não encontrado' } })
    }
  }

  async update ({ params, response, request, auth }) {
    try {
      const data = request.only(['title', 'description'])

      const project = await Project.findByOrFail({
        user_id: auth.user.id,
        id: params.id
      })

      project.merge(data)

      await project.save()

      return project
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Projeto não encontrado' } })
    }
  }

  async destroy ({ params, response, auth }) {
    try {
      const project = await Project.findByOrFail({
        user_id: auth.user.id,
        id: params.id
      })

      await project.delete()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Projeto não encontrado' } })
    }
  }
}

module.exports = ProjectController
