import { Request, Response, Router } from "express";
import { master } from "../..";

const router: Router = Router();

router.get('/servers', (request: Request, response: Response) => {
  const json: any[] = [];

  for (let index = 0; index < master.servers.length; index++) {
    const server = master.servers[index];

    if (server && server.json) {
      json.push(server.json);
    }
  }

  response.send(json);
});

export default router;