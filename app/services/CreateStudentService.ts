
import Student from 'App/Models/Student'
import User from 'App/Models/User'

interface Request{
  cpf: string
}

export default class CreateStudentTrainerService{
  public async execute (request: Request, user_id: string) {
    const user = await User.find(user_id)

    if(!user){
      throw new Error('Usuario não exite')
    }

    const personalTrainer = await Student.firstOrCreate({...request,
      user_id: user.id,
    })

    await personalTrainer.save()

    await personalTrainer.related('user').associate(user)

    return personalTrainer
  }
}
