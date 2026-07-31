
import { RequestHandler } from 'express'
import { HttpController } from '../../../presentation/http'
import { IHttpControllerOperation, HttpRequest } from '../../../presentation/http/contracts'

export const adaptRoute = (
  controllerOp: IHttpControllerOperation<HttpRequest>
): RequestHandler => {
  return async (req: any, res: any) => {
    const controller = new HttpController(controllerOp)
    const httpResponse = await controller.handle({ body: req.body, params: req.params, query: req.query, method: req.method, url: req.url })
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}