import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from 'App/Models/Student'
import CreateStudentTrainerService from 'App/services/CreateStudentService'
import StudentValidator from 'App/Validators/StudentValidator'

export default class StudentsController {
  private createStudentService = new CreateStudentTrainerService()

  public async store ({request, response, auth}: HttpContextContract){
    const user_id = auth.user?.id
    const body = await request.validate(StudentValidator)

    if(!user_id){
      throw new Error('Vazio')
    }

    const student = await this.createStudentService.execute(body, user_id)

    return response.status(200).json(student)
  }

  public async index ({ response}: HttpContextContract) {
    const query = Student.query()

    const students = await query.exec()

    if(students.length === 0){
      return response.status(204).json({message: 'has no datas'})
    }

    return response.status(200).json(students)
  }

  public async show ({params,response}: HttpContextContract) {
    if(!params.id){
      response.status(401).json({message: 'id vazio'})
    }

    const student = await Student.query()
      .where({id: params.id})
      .preload('user')
      .first()

    if(!student){
      return response.status(204).json({message: 'has no datas' })
    }

    return response.status(200).json(student)
  }

  public async update ({request,response, params}: HttpContextContract) {
    const body = request.post()
    const student = await Student.findOrFail(params.id)

    if (!student.$isPersisted) {
      throw new Error('Estudente não encontrado')
    }

    student.merge(body)

    await student.save()

    return response.status(200).json(student)
  }

  public async destroy ({response, params}: HttpContextContract) {
    const studentId = params.id
    const student = await Student.findOrFail(studentId)

    if (!student) {
      throw new Error(`o aluno: ${student} deletada com sucesso.`)
    }

    await student.delete()

    return response.status(200).json(student)
  }
}
