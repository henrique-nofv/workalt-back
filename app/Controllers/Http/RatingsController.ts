// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppError from 'App/Errors/AppError'
import Rating from 'App/Models/Rating'
import RatingValidator from 'App/Validators/RatingValidator'

export default class RatingsController {
  //Buscar todas as categorias
  public async index ({ response }: HttpContextContract) {
    const categories = await Rating.all()

    return response.status(200).json(categories)
  }

  public async store ({ request, response }: HttpContextContract) {
    const body = await request.validate(RatingValidator)

    const rating = await Rating.firstOrCreate(body)

    return response.status(200).json(rating)
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const body = request.post()
    const rating = await Rating.findOrFail(params.id)

    if (!rating.$isPersisted) {
      throw new Error('Rating not found')
    }

    rating.merge(body)

    await rating.save()

    return response.status(200).json(rating)
  }

  public async hasRating ({ response, params }: HttpContextContract) {
    const rating = await Rating.query().where('student_event_id',params.id)

    if (!rating) {
      throw new Error('Avaliação não encontrada!')
    }

    return response.status(200).json(rating)
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const id = params.id
    const rating = await Rating.findOrFail(id)

    if (!rating) {
      throw new Error(`A categoria: ${rating} foi deletada com sucesso.`)
    }

    await rating.delete()

    return response.status(200).json(rating)
  }

  public async show ({ params, response }: HttpContextContract) {
    if (!params.id) {
      // response.status(422).json({ message: 'id vazio' })
      throw new AppError('Não existe esse categoria', 404)
    }

    const rating = await Rating.query().where({ id: params.id }).first()

    if (!rating) {
      // return response.status(204).json({ message: 'has no datas' })
      throw new AppError('Não existe esse categoria', 404)
    }

    return response.status(200).json(rating)
  }
}
