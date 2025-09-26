require("dotenv").config(); // load .env
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(express.static(path.join(__dirname, "dist")));
morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (req, res) => {
  Person.countDocuments().then((count) => {
    return res.send(`
      <div>
          <div>Phonebook has info for ${count} people</div><br/>
          <div>${new Date()}</div><br/>
      </div>
      `);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (!person) return res.status(404).json({ error: "Person not found" });
      return res.status(200).json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name) return res.status(400).json({ error: "name is missing" });
  if (!number) return res.status(400).json({ error: "number is missing" });

  const person = new Person({
    name,
    number,
  });
  person
    .save()
    .then((savedPerson) => {
      return res.status(200).send(savedPerson);
    })
    .catch((error) => {
      if (error.errors?.number?.message || error.errors?.name?.message)
        return res.status(400).json({ error: error.errors?.number?.message });
      else next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({ error: "Person does not exist" });
      }

      person.name = name;
      person.number = number;

      return person
        .save()
        .then((updatedPerson) => {
          res.json(updatedPerson);
        })
        .catch((err) => {
          if (err.errors?.number?.message || err.errors?.name?.message)
            return res.status(400).json({ error: err.errors?.number?.message });
          else throw err;
        });
    })
    .catch((error) => next(error));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

module.exports = app;
