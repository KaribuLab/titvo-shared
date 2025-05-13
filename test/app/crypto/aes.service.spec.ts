import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AesService, ENCRYPTION_KEY_NAME_PROPERTY } from '@shared/app/crypto/aes.service'
import { SecretService } from '@shared/core/outputs/secret.service'

describe('AesService', () => {
  let aesService: AesService
  let mockSecretService: SecretService
  
  const ENCRYPTION_KEY_NAME = 'test-encryption-key'
  // Clave AES-256 válida (32 bytes / 256 bits) en formato Base64
  const TEST_SECRET = 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI='
  const TEST_DATA = 'Texto a cifrar y descifrar'
  
  beforeEach(() => {
    mockSecretService = {
      get: vi.fn().mockResolvedValue(TEST_SECRET)
    } as unknown as SecretService
    
    aesService = new AesService(mockSecretService, ENCRYPTION_KEY_NAME)
  })
  
  it('debe cifrar y descifrar correctamente un texto', async () => {
    // Cifrar el texto
    const textoEncriptado = await aesService.encrypt(TEST_DATA)
    
    // El texto cifrado debe ser diferente al original
    expect(textoEncriptado).not.toEqual(TEST_DATA)
    
    // Descifrar el texto
    const textoDescifrado = await aesService.decrypt(textoEncriptado)
    
    // El texto descifrado debe ser igual al original
    expect(textoDescifrado).toEqual(TEST_DATA)
  })
  
  it('debe lanzar un error si la clave de encriptación no se encuentra', async () => {
    // Modificar el mock para que devuelva undefined
    vi.spyOn(mockSecretService, 'get').mockResolvedValueOnce(undefined as any)
    
    // Verificar que el método encrypt lanza un error
    await expect(aesService.encrypt(TEST_DATA)).rejects.toThrow('AES secret not found')
    
    // Modificar el mock para que devuelva undefined nuevamente
    vi.spyOn(mockSecretService, 'get').mockResolvedValueOnce(undefined as any)
    
    // Verificar que el método decrypt lanza un error
    await expect(aesService.decrypt('cualquier-texto')).rejects.toThrow('AES secret not found')
  })
  
  it('debe llamar a secretService.get con el nombre de la clave correcto', async () => {
    await aesService.encrypt(TEST_DATA)
    
    expect(mockSecretService.get).toHaveBeenCalledWith(ENCRYPTION_KEY_NAME)
  })
}) 