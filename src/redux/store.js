import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { root_reducer } from "./reduce/index";

const store = createStore(root_reducer, composeWithDevTools());

export default store;
