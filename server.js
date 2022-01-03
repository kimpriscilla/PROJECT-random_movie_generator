const express = require("express");
const { static } = express;
const path = require("path");
const {
  syncAndSeed,
  models: { Movie },
} = require("./db/server");
const Sequelize = require("sequelize");
const app = express();

//body parsing middleware for post & put routes

app.use("/dist", static(path.join(__dirname, "dist")));

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.use(express.json());

app.get("/api/movies", async (req, res, next) => {
  try {
    res.send(await Movie.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/movies", async (req, res, next) => {
  try {
    res.send(await Movie.randomMovie());
  } catch (error) {
    next(error);
  }
});

app.put("/api/movies/:id", async (req, res, next) => {
  try {
    let movie = await Movie.findByPk(req.params.id);
    // where do console.log show up?
    console.log("-------------", movie);
    await movie.update(req.body);
    res.send(movie);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/movies/delete/:id", async (req, res, next) => {
  try {
    const deleteMovie = await Movie.findByPk(req.params.id);
    deleteMovie.destroy();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
