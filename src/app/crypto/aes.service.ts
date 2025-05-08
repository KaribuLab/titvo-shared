import { createCipheriv, CipherKey } from 'crypto'
import { Inject, Injectable } from '@nestjs/common'
import { SecretService } from '@titvo/shared'

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
    return cipher.update(data, 'utf8', 'base64') + cipher.final('base64')
  }
}
