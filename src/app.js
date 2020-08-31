const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: uuidValidate } = require('uuid');
const { json } = require("express");

const app = express();

app.use(express.json());
app.use(cors()); // Não foi mostrado na aula, ver isto depois

const repositories = [];

// Middlewares Start

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if ( !uuidValidate(id) ){
    return response .status(400)
                    .json({ error: "Invalid Repository Id." });
  }
  
  return next();
}
app.use('/repositories/:id', validateRepositoryId);

// Middlewares End

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repoIndex = repositories.findIndex(repository => repository.id === id);
  if (repoIndex < 0){
    return response .status(400)
                    .json({ error: "Repository not found." });
  }

  const editedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
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

  return response.json(repositories[repoIndex]);

});

module.exports = app;
