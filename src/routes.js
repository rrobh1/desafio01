import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (title && description) {
        const user = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        database.insert("tasks", user);

        return res.writeHead(201).end();
      }

      return res
        .writeHead(400)
        .end(
          `Os seguintes campos não foram inforamdos: ${title ? "" : "title"} ${
            description ? "" : "description"
          }`
        );
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (title && description)
        return res
          .writeHead(400)
          .end("Não e possivel alterar duas propriedades simultaneamente");

      if (title || description) {
        const task = database.update("tasks", id, {
          title,
          description,
        });
        if (!task) return res.writeHead(400).end("Task não encontrada");

        return res.writeHead(204).end();
      }

      return res
        .writeHead(400)
        .end(
          `Os seguintes campos não foram inforamdos: ${title ? "" : "title"} ${
            description ? "" : "description"
          }`
        );
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const { completed } = req.body;

      const task = database.update("tasks", id, {
        completed_at: completed ? new Date() : null,
      });

      if (!task) return res.writeHead(400).end("Task não encontrada");
      return res.writeHead(204).end(JSON.stringify(task));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
];
