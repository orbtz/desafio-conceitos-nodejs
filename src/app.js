const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
// app.use(cors()); // Não foi mostrado na aula, ver isto depois

const repositories = [];

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { name, url, techs, likes } = request.body;
  
  const newRepository = {
    id: uuid(),
    name,
    url,
    techs,
    likes
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { name, url, techs, likes } = request.body;
  
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  if (repoIndex < 0){
    return response .status(400)
                    .json({ error: "Repository not found." });
  }

  const editedRepository = {
    id,
    name,
    url,
    techs,
    likes
  };

  repositories[repoIndex] = editedRepository;

  return response.json(editedRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  if (repoIndex < 0){
    return response .status(400)
                    .json({ error: "Repository not found." });
  }

  repositories.splice(repoIndex, 1);

  return response .status(204)
                  .send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  if (repoIndex < 0){
    return response .status(400)
                    .json({ error: "Repository not found." });
  }
  
  repositories[repoIndex].likes += 1;

  return response.status(200).send();

});

module.exports = app;
