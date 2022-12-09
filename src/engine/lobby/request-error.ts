export class RequestError {
  constructor(public readonly data: { [_field: string]: string }) {}
}
