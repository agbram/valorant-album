import { HttpRequest } from '../../../src/presentation/http/contracts'

export class HttpRequestBuilder {
  private constructor(private httpRequest: HttpRequest) {}

  static anHttpRequest = (): HttpRequestBuilder => {
    return new HttpRequestBuilder({
      body: {},
      params: {},
      query: {},
      method: 'GET',
      url: '/',
      accessToken: 'validToken'
    })
  }

  public withBody = <T extends object = object>(body: T): HttpRequestBuilder => {
    this.httpRequest.body = body
    return this
  }

  public withParams = <T extends object = object>(params: T): HttpRequestBuilder => {
    this.httpRequest.params = params
    return this
  }

  public withQuery = <T extends object = object>(query: T): HttpRequestBuilder => {
    this.httpRequest.query = query
    return this
  }

  public build = (): HttpRequest => {
    return this.httpRequest
  }
}
