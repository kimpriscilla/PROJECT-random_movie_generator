import { applyMiddleware, createStore } from "redux";
import loggerMiddleware from "redux-logger";

const initialState = {
  movies: [],
  rating: 3,
};

export function loadMovies(movie) {
  return {
    type: "LOAD_MOVIES",
    payload: movie,
  };
}

export function addMovies(movie) {
  return {
    type: "ADD_MOVIE",
    payload: movie,
  };
}

export function changeRating(data) {
  return {
    type: "CHANGE_RATING",
    payload: data,
  };
}

export function deletedMovies(id) {
  return {
    type: "DELETED_MOVIE",
    payload: id,
  };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_MOVIES":
      return {
        ...state,
        movies: action.payload,
      };
    case "ADD_MOVIE":
      return {
        ...state,
        movies: [...state.movies, action.payload],
      };
    case "CHANGE_RATING":
      state = {
        ...state,
        movies: state.movies.map((movie) => {
          if (movie.id === action.payload.id) {
            return action.payload;
          }
          return movie;
        }),
      };
    case "DELETED_MOVIE":
      console.log("AHHHHHHHH" + action.payload);
      state = {
        ...state,
        movies: state.movies.filter((movie) => {
          return movie.id !== action.payload;
        }),
      };
    default:
      return state;
  }
};

// const reducer = (state = initialState, action) => {
//   if (action.type === "LOAD_MOVIES") {
//     state = { ...state, movies: action.movie };
//   }
//   if (action.type === "ADD_MOVIE") {
//     state = { ...state, movies: [...state.movies, action.pretzels] }; //NEED TO SPLATE OUT STATE.MOVIES SO WE ADD ONTO LIST. ADDING ACTION.PRETZELS TO AN ARRAY
//   }
//   return state;
// }; //!we dont call this, it gets called for us

const store = createStore(reducer);
export default store;
