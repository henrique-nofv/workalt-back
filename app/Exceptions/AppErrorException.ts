import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import AppError from 'App/Errors/AppError'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@poppinss/utils` allows defining
| a status code and error code for every exception.
|
| @example
| new AppErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AppErrorException extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle (error: AppError | Error, { response }: HttpContextContract) {
    if (error instanceof AppError) {
      return response.status(422).json({ message: error.message, error })
    }

    return response.status(500).json({ message: 'Internal server error' })
  }
}
