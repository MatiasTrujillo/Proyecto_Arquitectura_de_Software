import { Request, Response } from "express";

export class MockResponse {
  statusCode = 0;
  body: any = undefined;
  sent = false;

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  json(payload: any): this {
    this.body = payload;
    this.sent = true;
    return this;
  }

  send(payload?: any): this {
    this.body = payload;
    this.sent = true;
    return this;
  }
}

export function crearRequestMock(params: Record<string, any> = {}, body: any = {}): Partial<Request> {
  return { params, body } as Partial<Request>;
}

export function crearResponseMock(): MockResponse {
  return new MockResponse();
}
