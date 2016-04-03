declare module 'connect-history-api-fallback' {
  import http = require("http");

  interface MiddlewareHandler {
      (req: http.ServerRequest, res: http.ServerResponse, next: Function): any;
  }

  var tmp: () => MiddlewareHandler;
  export = tmp;
}
