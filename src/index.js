import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import store, {
  loadMovies,
  addMovies,
  changeRating,
  deletedMovies,
} from "./store";

class App extends Component {
  constructor() {
    super();
    this.state = store.getState();
    this.addMovie = this.addMovie.bind(this);
    // this.increaseRating = this.increaseRating(this);
  }

  async componentDidMount() {
    const movie = (await axios.get("/api/movies")).data;
    console.log("show me THIS", movie);
    store.subscribe(() => {
      this.setState(store.getState());
    });
    store.dispatch(
      loadMovies(movie)
      // type: "LOAD_MOVIES",
      // movie: movie, //SENDING OVER AN ARRAY BC AXIOS.GET IS ALREADY AN ARRAY OF OBJS
    );
  }
  async addMovie() {
    const addMovie = (await axios.post("/api/movies")).data;
    //console.log(addMovie);
    //thunk bc we're its async
    store.dispatch(
      addMovies(addMovie)
      // type: "ADD_MOVIE",
      // pretzels: addMovie, //SENDING OVER AN OBJ
    );
  }
  async increaseRating(movie) {
    // put request modify/updates info
    // second para in put is a http body request, which is data that is sent by the client to API
    try {
      console.log("MOVIE", movie);
      movie = { ...movie, rating: movie.rating + 1 };
      const data = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
      store.dispatch(changeRating(data));
    } catch (error) {
      console.log(error);
    }
  }
  async decrementRating(movie) {
    try {
      movie = { ...movie, rating: movie.rating - 1 };
      const data = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
      store.dispatch(changeRating(data));
    } catch (error) {
      console.log(error);
    }
  }
  async deleteMovie(id) {
    try {
      await axios.delete(`/api/movies/delete/${id}`);
      store.dispatch(deletedMovies(id));
    } catch (error) {
      console.log(error);
    }
  }
  //way to sort strings
  sortByName(a, b) {
    return a.name.localeCompare(b.name);
  }
  //way to sort integers
  sortByRating(a, b) {
    return b.rating - a.rating;
  }
  calculateAvg(movies) {
    const avg = (
      movies.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0) / movies.length
    ).toFixed(1);
    return movies.length === 0 ? 0 : avg;
  }
  render() {
    const { movies, loading } = this.state;
    const {
      addMovie,
      increaseRating,
      decrementRating,
      deleteMovie,
      calculateAvg,
    } = this;
    movies.sort(this.sortByName);
    movies.sort(this.sortByRating);
    //calculate for average of ratings
    // add up all the ratings / number of ratings
    //
    if (loading) {
      return "....loading";
    }
    return (
      <>
        <div>
          <h1>Random Movie Generator </h1>
          <h2>Average Rating: {calculateAvg(movies)}</h2>
        </div>
        <div>
          <div className="random">
            <button className="randomButton" onClick={addMovie}>
              randomMovie
            </button>
          </div>
        </div>
        <div className="idk">
          <ul className="info">
            {movies
              .map((movie) => {
                return (
                  <li className="lists" key={movie.id}>
                    {movie.name}, Rating: {movie.rating}{" "}
                    <button
                      className="increaseButton"
                      onClick={() => increaseRating(movie)}
                    >
                      +
                    </button>
                    <button
                      className="decreaseButton"
                      onClick={() => decrementRating(movie)}
                    >
                      -
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => deleteMovie(movie.id)}
                    >
                      X
                    </button>
                  </li>
                );
              })
              .sort()}
          </ul>
        </div>
      </>
    );
  }
}

render(<App />, document.querySelector("#root"));
