'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }

  async show ({ params, srequest, response }) {
    try {
      const { file } = await File.findOrFail(params.id)

      return response.download(Helpers.tmpPath(`uploads/${file}`))
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Arquivo não encontrado!' } })
    }
  }
}

module.exports = FileController