export interface GetSignedUrlInput {
  containerName: string
  filePath: string
  contentType: string
  expiresIn: number
}

export interface GetSignedUrlOutput {
  url: string
}

export abstract class StorageService {
  abstract getSignedUrl (input: GetSignedUrlInput): Promise<GetSignedUrlOutput>
}
