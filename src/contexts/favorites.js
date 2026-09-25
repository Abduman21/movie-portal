import { createContext, useContext } from "react";
export const MovieContext = createContext(null);
export const useMovieContext = () => useContext(MovieContext);
