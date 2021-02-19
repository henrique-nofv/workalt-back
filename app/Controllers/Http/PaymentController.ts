import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MakePaymentService from 'App/services/Payment/MakePaymentSerivce'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import Plan from 'App/Models/Plan'

export default class PaymentController {
  public async makePayment ({ request, response, auth }: HttpContextContract) {
    const { token } = request.post()

    const user_id = auth.user?.id

    const personal = await PersonalTrainer.findBy('user_id', user_id)

    const plans = await Plan.all()

    const plan = plans[0]

    if (plan === null || personal === null) {
      throw new Error('não tem personal ou plano')
    }

    const makePayment = new MakePaymentService()

    const payment = await makePayment.execute({
      personal_trainer_id: personal.id,
      plan_id: plan.id,
      token: {
        tokenId: token,
      },
    })

    return response.status(200).json(payment)
  }
}
