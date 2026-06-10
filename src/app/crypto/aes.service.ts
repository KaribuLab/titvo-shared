import { createCipheriv, createDecipheriv, CipherKey } from 'crypto'
import { Inject, Injectable } from '@nestjs/common'
import { SecretService } from '../../core/outputs/secret.service'

export const ENCRYPTION_KEY_NAME_PROPERTY = 'ENCRYPTION_KEY_NAME'
@Injectable()
export class AesService {
  constructor (private readonly secretService: SecretService, @Inject(ENCRYPTION_KEY_NAME_PROPERTY) private readonly encryptionKeyName: string) { }

  async encrypt (data: string): Promise<string> {
    const secretBase64 = await this.secretService.get(this.encryptionKeyName)
    if (secretBase64 === undefined) {
      throw new Error('AES secret not found')
    }
    const secret = Buffer.from(secretBase64, 'base64') as CipherKey
    const cipher = createCipheriv('aes-256-ecb', secret, null)
    const encrypted = cipher.update(data, 'utf8', 'base64') as string
    const final = cipher.final('base64') as string
    return encrypted + final
  }

  async decrypt (data: string): Promise<string> {
    const secretBase64 = await this.secretService.get(this.encryptionKeyName)
    if (secretBase64 === undefined) {
      throw new Error('AES secret not found')
    }
    const secret = Buffer.from(secretBase64, 'base64') as CipherKey
    const decipher = createDecipheriv('aes-256-ecb', secret, null)
    const decrypted = decipher.update(data, 'base64', 'utf8') as string
    const final = decipher.final('utf8') as string
    return decrypted + final
  }
}
