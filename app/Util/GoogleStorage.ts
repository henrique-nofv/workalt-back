import { Storage, UploadResponse } from '@google-cloud/storage'
import Env from '@ioc:Adonis/Core/Env'

export default class GoogleStorage {
  private projectId = Env.get('GCS_PROJECT') as string

  private bucketName = Env.get('GCS_BUCKET') as string

  // private apiKey = Env.get('GCS_API_KEY') as string

  // private pathKeyFile = Env.get('GCS_KEY_FILE') as string

  private storage: Storage = new Storage({
    projectId: this.projectId,
    // keyFilename: `${Application.appRoot}/${this.pathKeyFile}`,
  })

  public async upload (filePath: string, fileName: string, file: any): Promise<string>{
    // console.log('pathKeyFile',`${Application.appRoot}/${this.pathKeyFile}`)
    try {
      const bucket: UploadResponse = await this.storage
        .bucket(this.bucketName)
        .upload(filePath, {
          destination: fileName,
          contentType: file.headers['content-type'],
          gzip: true,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        })
      return `https://storage.googleapis.com/teste-workalt/${bucket[0].metadata.name}`
    } catch (error) {
      throw new Error(error)
    }
  }

  public async fileExist (fileName: string) {
    const [files] = await this.storage.bucket(this.bucketName).getFiles()
    const listFiles: string[] = files.map((file) => file.name)

    if (listFiles.includes(fileName)) {
      return true
    } else {
      return false
    }
  }
}
