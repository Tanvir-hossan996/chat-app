import React, { Component } from "react";
import { Container, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  auth,
  signInWithEmailAndPassword,
  getDatabase,
  ref,
  set,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../firebase-config";
import chatImg from "../../Images/login-img.png";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    errorMsg: "",
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isEmpty(this.state)) {
      this.setState({ loading: true });
      signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          console.log(userCredential);
          this.setState({ email: "" });
          this.setState({ password: "" });
          this.setState({ errorMsg: "" });
          this.setState({ loading: false });
          this.writeUserData(userCredential);
        })

        .catch((error) => {
          const errorCode = error.code;
          if (errorCode.includes("user-not-found")) {
            this.setState({ errorMsg: "This User not found" });
          }
          if (errorCode.includes("wrong-password")) {
            this.setState({ errorMsg: "Enter Your Correct Password" });
          }
          console.log(errorCode);
          this.setState({ loading: false });
        });
    }
  };

  googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      this.writeGoogleUserData(result);
    });
  };

  writeGoogleUserData = (user) => {
    console.log(user);
    const db = getDatabase();
    set(ref(db, "users/" + user.user.uid), {
      username: user.user.displayName,
      email: user.user.email,
    });
  };

  isEmpty = ({ userName, email, password, confirmPassword }) => {
    if (!email.length && !password.length) {
      this.setState({ errorMsg: "Please enter the all field" });
    } else if (!email.length) {
      this.setState({ errorMsg: "Enter your email" });
    } else if (!password.length) {
      this.setState({ errorMsg: "Enter your password" });
    } else {
      return true;
    }
  };

  render() {
    const { email, password, loading, errorMsg } = this.state;
    return (
      <>
        <div className="register" style={{ marginTop: "20px" }}>
          <Container>
            <Row>
              <Col lg={6}>
                {" "}
                <div className="register_img">
                  <img src={chatImg} style={{ width: "100%" }} alt="" />
                </div>
              </Col>
              <Col lg={5}>
                <div className="register_form" style={{ marginTop: "100px" }}>
                  <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Log In Your Account</h1>

                  <Button
                    style={{ width: "80%", marginLeft: "10%", marginBottom: "15px" }}
                    variant="outline-dark"
                    onClick={this.googleSignIn}
                  >
                    Sign In with <FcGoogle style={{ fontSize: "22px" }} />{" "}
                  </Button>
                  <p style={{ textAlign: "center", margin: "0px" }}>or</p>

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control name="email" type="email" onChange={this.handleChange} placeholder="E-mail" value={email} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        onChange={this.handleChange}
                        placeholder="Password"
                        value={password}
                      />
                    </Form.Group>
                    <Button onClick={this.handleSubmit} style={{ width: "100%", background: "#0c316e" }} type="submit">
                      {loading ? <Spinner animation="border" size="sm" disabled /> : "SUBMIT"}
                    </Button>
                  </Form>
                  <p style={{ textAlign: "center", marginTop: "10px", fontWeight: "600" }}>
                    Don't Have An Account?
                    <Link style={{ textDecoration: "none" }} to="/register">
                      {"  "}
                      Sign Up
                    </Link>
                  </p>
                  {errorMsg ? (
                    <button
                      style={{
                        width: "100%",
                        background: "#FFF6F6",
                        border: "1px solid #912D2B",
                        color: "#912D2B",
                        padding: "10px 0px",
                        fontSize: "18px",
                        fontWeight: "500",
                        borderRadius: "5px",
                      }}
                    >
                      {errorMsg}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
