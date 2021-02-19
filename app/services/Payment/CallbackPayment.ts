// public async webhook ({ request, response }: HttpContextContract) {
//   // const endpointSecret = Env.get('STRIPE_ENDPOINT', '') as string
//   // const sig = request.header('stripe-signature') as string | Buffer | string[]
//   const event = request.post() as Stripe.Event

//   // let event: Stripe.Event

//   // try {
//   //   event = await this.stripe.webhooks.constructEvent(body, sig, endpointSecret)
//   // } catch (error) {
//   //   console.log('Erro ao criar evento')
//   //   return response.status(400).send(`Webhook error: ${error.message}`)
//   // }

//   switch (event.type) {
//     case 'charge.refunded': {
//       // const charge = event.data.object
//       // TODO: definir o que fazer quando fizer o reembolso do pagamento
//       break
//     }
//     case 'charge.succeeded': {
//       const charge = event.data.object as Stripe.Charge
//       const payment = await Payment.findBy('charge_id', charge.id)
//       if (payment) {
//         payment.paidAt = DateTime.local()
//         payment.save()
//       }
//       break
//     }
//     default:
//     // Unexpected event type
//       return response.status(400).send({ msg: 'event type not handled'})
//   }
//   // Return a response to acknowledge receipt of the event
//   response.json({received: true})
// }
