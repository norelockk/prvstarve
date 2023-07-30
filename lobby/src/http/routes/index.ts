import { Request, Response, Router } from "express";
import { master } from "../..";
import { isValidUUID } from "../../utils";
import Server from "../../master/Server";

const router: Router = Router();

router.get('/servers', (request: Request, response: Response) => {
  const json: any[] = [];

  for (let index = 0; index < master.servers.length; index++) {
    const server = master.servers[index];

    if (server) json.push(server.json('info'));
  }

  response.send(json);
});

router.get('/server/:uuid', (request: Request, response: Response) => {
  let { uuid } = request.params;
  uuid = uuid.trim();

  if (uuid === '' || uuid.length === 0 || !isValidUUID(uuid))
    return response.status(403).send({});

  const server: Server = master.servers.find(s => s && s.uuid === uuid) as Server;
  if (server) return response.send(server.json('response'));

  return response.status(404).send({});
})

export default router;