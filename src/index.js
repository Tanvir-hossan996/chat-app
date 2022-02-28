import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "./firebase-config";
import Wellcome from "./Components/Auth/Wellcome";
import store from "./redux/store";
import { Provider } from "react-redux";

class Routering extends Component {
  state = {
    tracker: false,
  };

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ tracker: true });
      } else {
        this.setState({ tracker: false });
      }
    });
  }

  render() {
    return (
      <BrowserRouter>
        {this.state.tracker ? (
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/login" element={<Navigate to="/" />}></Route>
            <Route path="/register" element={<Navigate to="/login" />}></Route>
            <Route path="/wellcome" element={<Navigate to="/" />}></Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/wellcome" />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/wellcome" element={<Wellcome />}></Route>
          </Routes>
        )}
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Routering />
  </Provider>,
  document.getElementById("root")
);
