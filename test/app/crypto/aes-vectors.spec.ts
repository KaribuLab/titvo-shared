import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { AesService } from '@shared/app/crypto/aes.service'
import { SecretService } from '@shared/core/outputs/secret.service'

/**
 * Cross-implementation byte-compatibility lock-down.
 *
 * These vectors are shared verbatim (byte-identical copies) across
 * titvo-shared (TS), titvo-installer (Go) and titvo-rag-indexer (Python).
 * All three implementations derive the same 32-byte AES-256 key by
 * base64-decoding the same Secrets Manager value and must produce the
 * exact same ciphertext for the exact same plaintext (AES-256-ECB + PKCS7).
 */

interface AesVector {
  name: string
  plaintext: string
  expected_ciphertext_base64: string
}

interface AesFixture {
  key_base64: string
  vectors: AesVector[]
}

const fixturePath = join(__dirname, '../../fixtures/aes-test-vectors.json')
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as AesFixture

describe('AesService — cross-implementation byte-compatibility vectors', () => {
  let aesService: AesService
  let mockSecretService: SecretService

  const ENCRYPTION_KEY_NAME = 'test-encryption-key'

  beforeEach(() => {
    mockSecretService = {
      get: vi.fn().mockResolvedValue(fixture.key_base64)
    } as unknown as SecretService

    aesService = new AesService(mockSecretService, ENCRYPTION_KEY_NAME)
  })

  it.each(fixture.vectors)(
    'encrypts "$name" to the exact shared-fixture ciphertext',
    async ({ plaintext, expected_ciphertext_base64: expected }) => {
      const actual = await aesService.encrypt(plaintext)
      expect(actual).toBe(expected)
    }
  )

  it.each(fixture.vectors)(
    'decrypts "$name" from the exact shared-fixture ciphertext',
    async ({ plaintext, expected_ciphertext_base64: expected }) => {
      const actual = await aesService.decrypt(expected)
      expect(actual).toBe(plaintext)
    }
  )
})
