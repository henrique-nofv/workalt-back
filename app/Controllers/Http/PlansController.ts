import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Plan from 'App/Models/Plan'
import PlanValidator from 'App/Validators/PlanValidator'

export default class PlansController {
  public async store ({ request, response }: HttpContextContract) {
    const body = await request.validate(PlanValidator)

    const plan = await Plan.firstOrCreate(body)

    return response.status(200).json(plan)
  }

  //buscar cartãoes do personal por segurança
  public async index ({ response }: HttpContextContract) {
    const plans = await Plan.all()

    return response.status(200).json(plans)
  }

  public async show ({ params, response }: HttpContextContract) {
    if (!params.id) {
      response.status(422).json({ message: 'id vazio' })
    }

    const plan = await Plan.query().where({ id: params.id }).first()

    if (!plan) {
      return response.status(204).json({ message: 'Não tem dados' })
    }

    return response.status(200).json(plan)
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const body = request.post()
    const plan = await Plan.findOrFail(params.id)

    if (!plan.$isPersisted) {
      throw new Error('Personal not found')
    }

    plan.merge(body)

    await plan.save()

    return response.status(200).json(plan)
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const id = params.id
    const plan = await Plan.findOrFail(id)

    if (!plan) {
      throw new Error(`o plan: ${plan} deletada com sucesso.`)
    }

    await plan.delete()

    return response.status(200).json(plan)
  }
}
