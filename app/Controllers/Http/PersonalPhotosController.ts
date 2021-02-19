import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { default as PersonalPhoto, default as PersonalPhotos } from 'App/Models/PersonalPhoto'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import GoogleStorage from 'App/Util/GoogleStorage'

export default class PersonalPhotosController {
  public async store ({ request, auth}: HttpContextContract) {
    const user_id = auth.user?.id

    if (!user_id) {
      throw new Error('Sem user')
    }

    const personal = await PersonalTrainer.findBy('user_id', user_id)

    if (!personal) {
      throw new Error('Personal não existe')
    }

    const photo = request.file('photo')

    if (!photo?.tmpPath) {
      throw new Error('Não foi enviado o arquivo')
    }
    let photoName
    try {
      const googleStorage = new GoogleStorage()
      photoName = encodeURI(`${Date.now()}${photo.clientName}`)
      const response = await googleStorage.upload(
        photo.tmpPath,
        `images/${photoName}`,
        photo
      )
      const personalPhoto = await PersonalPhoto.create({ personal_trainer_id: personal.id, url: response })

      await personalPhoto.save()

      await personalPhoto.related('personal').associate(personal)

      return personalPhoto
    } catch (e) {
      return e
    }
  }

  public async index ({ auth, response }: HttpContextContract) {
    const user_id = auth.user?.id

    if (!user_id) {
      throw new Error('Sem user')
    }

    const personal = await PersonalTrainer.findBy('user_id', user_id)

    if (!personal) {
      throw new Error('Sem personal')
    }

    const personalPhotos = await PersonalPhoto.query().where({ personal_trainer_id: personal.id })

    return response.status(200).json(personalPhotos)
  }

  public async show ({ response, params }: HttpContextContract) {
    const personal_trainer_id = params.personal_trainer_id
    console.log('show')

    if (!personal_trainer_id) {
      throw new Error('Sem user')
    }

    const personal = await PersonalTrainer.find(personal_trainer_id)

    if (!personal) {
      throw new Error('Sem personal')
    }

    const personalPhotos = await PersonalPhoto.query().where({ personal_trainer_id: personal.id })

    return response.status(200).json(personalPhotos)
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const personal_photo_id = params.personal_photo_id
    const personalPhotos = await PersonalPhotos.find(personal_photo_id)

    if (!personalPhotos) {
      throw new Error(`o personal: ${personalPhotos} deletada com sucesso.`)
    }

    await personalPhotos.delete()

    return response.status(200).json({ msg: 'Foto removida com sucesso' })
  }
}
