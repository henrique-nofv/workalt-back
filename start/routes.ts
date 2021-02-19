/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/register', 'AuthController.register')
  Route.post('/logout', 'AuthController.logout')
  Route.put('/avatar/:user_id', 'AuthController.updateAvatar')
}).prefix('auth')

Route.post('/personals', 'PersonalTrainersController.store')

//ROTA TESTES
Route.group(() =>{
  Route.get('/personal/:id/events', 'PersonalTrainersController.PersonalEvents')
  Route.get('/student/:id/events', 'EventStudentsController.StudentEvents')
  Route.get('/personals', 'PersonalTrainersController.index')
  Route.get('/personals/:id', 'PersonalTrainersController.show')
  Route.put('/personals/:id', 'PersonalTrainersController.update')
  Route.delete('/personals/:id', 'PersonalTrainersController.destroy')
  Route.put('/personals/:id/status', 'PersonalTrainersController.changeStatusPersonal')
  Route.post('/personal/photos', 'PersonalPhotosController.store')
  Route.get('/personal/photos', 'PersonalPhotosController.index')
  Route.get('/personal/photos/:personal_trainer_id', 'PersonalPhotosController.show')
  Route.delete('/personal/photos/:personal_photo_id', 'PersonalPhotosController.destroy')
  Route.resource('/students', 'StudentsController').apiOnly()
  Route.resource('/plans', 'PlansController').apiOnly()
  Route.resource('/ratings', 'RatingsController').apiOnly()
  Route.get('/rating/:id', 'RatingsController.hasRating')
  Route.resource('/subscriptions', 'SubscriptionsController').apiOnly()
  Route.resource('/subscriptions/renew', 'SubscriptionsController.renewSubscription').apiOnly()
  Route.resource('/events', 'EventsController').apiOnly()
  Route.resource('/creditcards', 'CreditCardsController').apiOnly()
  Route.resource('/categories', 'CategoriesController').apiOnly()
  Route.resource('/address', 'AddressesController').apiOnly()
  Route.resource('/event/students', 'EventStudentsController').apiOnly()
  Route.delete('/event/:event_id/student/:student_id', 'EventStudentsController.removeStudentEvent')
  Route.patch('/event/:event_id/student/:student_id', 'EventStudentsController.isPresentStudentInEvent')
  Route.post('/payment', 'PaymentController.makePayment')
}).middleware('auth')

//TODO: CRIAR AS ROTAS QUE PERSONAL POR USAR
// Route.group(() =>{
//   Route.resource('/personals', 'PersonalTrainersController')
// }).middleware('auth').prefix('personal')

//TODO: CRIAR AS ROTAS QUE ESTUDANTE POR USAR
// Route.group(() =>{
// Route.resource('/personals', 'PersonalTrainersController')
// Route.resource('/students', 'StudentsController')
// Route.resource('/plans', 'PlansController')
// Route.resource('/categories', 'CategoriesController')
// Route.resource('/subscriptions', 'SubscriptionsController')
// }).middleware('auth')

// HOOK PARA PEGAR SE PAGAMENTO SEU CERTO
Route.post('stripe/webhook', 'App/PaymentsController.webhook')

