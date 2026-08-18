import { ConnectionError } from '../../src/domain/errors'
import { HttpController } from '../../src/presentation/http'
import {
  IHttpControllerOperation,
  HttpRequest,
  HttpControllerOperationResponse,
  HttpResponse
} from '../../src/presentation/http/contracts'
import { right, left } from '../../src/shared'
import { HttpRequestBuilder } from '../utils/builders'

type ISutType = {
  sut: HttpController
  controllerOperationStub: IHttpControllerOperation
}

const makeControllerOperationStub = (): IHttpControllerOperation => {
  class ControllerOperationStub implements IHttpControllerOperation {
    async operate(_request: HttpRequest): HttpControllerOperationResponse<any> {
      return right({
        statusCode: 200,
        body: 'Success'
      })
    }
  }

  return new ControllerOperationStub()
}

const makeSut = (): ISutType => {
  const controllerOperationStub = makeControllerOperationStub()
  const sut = new HttpController(controllerOperationStub)

  return { sut, controllerOperationStub }
}

describe('Http Controller', () => {
  it('Should return the operation success response if it is right', async () => {
    const { sut } = makeSut()

    const httpRequest = HttpRequestBuilder.anHttpRequest().build()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual<HttpResponse>({
      statusCode: 200,
      body: 'Success'
    })
  })

  it('Should return the mapped http response error if the operation returns left', async () => {
    const { sut, controllerOperationStub } = makeSut()

    jest.spyOn(controllerOperationStub, 'operate').mockImplementation(async () => {
      return left(new ConnectionError('Solution').error)
    })

    const httpRequest = HttpRequestBuilder.anHttpRequest().build()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual<HttpResponse>({
      statusCode: 500,
      body: {
        message:
          'Connection to service failed: Connection with Solution has failed.; Unexpected error',
        name: 'ConnectionError',
        object: 'Solution',
        reason: 128
      }
    })
  })

  it('Should return a mapped server error if the operation throws', async () => {
    const { sut, controllerOperationStub } = makeSut()

    jest.spyOn(controllerOperationStub, 'operate').mockImplementation(async () => {
      throw new Error('Description')
    })

    const httpRequest = HttpRequestBuilder.anHttpRequest().build()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual<HttpResponse>({
      statusCode: 500,
      body: {
        message: 'Server error: Description.',
        name: 'ServerError',
        reason: 129
      }
    })
  })
})
