import { createCipheriv, CipherKey } from 'crypto'
import { Injectable } from '@nestjs/common'
import { SecretService } from '@titvo/shared'
@Injectable()
export class AesService {
  constructor (private readonly secretService: SecretService) { }

  async encrypt (data: string): Promise<string> {
    const secretBase64 = await this.secretService.get('aes_secret')
    if (secretBase64 === undefined) {
      throw new Error('AES secret not found')
    }
    const secret = Buffer.from(secretBase64, 'base64') as CipherKey
    const cipher = createCipheriv('aes-256-ecb', secret, null)
    return cipher.update(data, 'utf8', 'base64') + cipher.final('base64')
  }
}
