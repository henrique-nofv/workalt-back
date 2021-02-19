import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppError from 'App/Errors/AppError'
import Category from 'App/Models/Category'
import CategoryValidator from 'App/Validators/CategoryValidator'

export default class CategoriesController {
  //Buscar todas as categorias
  public async index ({ response }: HttpContextContract) {
    const categories = await Category.all()

    return response.status(200).json(categories)
  }

  public async store ({ request, response }: HttpContextContract) {
    const body = await request.validate(CategoryValidator)

    const category = await Category.firstOrCreate(body)

    return response.status(200).json(category)
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const body = request.post()
    const student = await Category.findOrFail(params.id)

    if (!student.$isPersisted) {
      throw new Error('Category not found')
    }

    student.merge(body)

    await student.save()

    return response.status(200).json(student)
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const id = params.id
    const category = await Category.findOrFail(id)

    if (!category) {
      throw new Error(`A categoria: ${category} foi deletada com sucesso.`)
    }

    await category.delete()

    return response.status(200).json(category)
  }

  public async show ({ params, response }: HttpContextContract) {
    if (!params.id) {
      // response.status(422).json({ message: 'id vazio' })
      throw new AppError('Não existe esse categoria', 404)
    }

    const category = await Category.query().where({ id: params.id }).first()

    if (!category) {
      // return response.status(204).json({ message: 'has no datas' })
      throw new AppError('Não existe esse categoria', 404)
    }

    return response.status(200).json(category)
  }
}
