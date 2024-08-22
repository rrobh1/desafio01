import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extratQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;

    req.query = query ? extratQueryParams(query) : {};

    console.log(req.query);

    return route.handler(req, res);
  }
  console.log(route);
  return res.writeHead(404).end();
});
server.listen(3333);
