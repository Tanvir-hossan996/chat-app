import React, { Component } from "react";
import { Container, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  getDatabase,
  ref,
  set,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../firebase-config";
import chatImg from "../../Images/register-img.png";

export default class Register extends Component {
  state = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMsg: "",
    loading: false,
    succMsg: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isEmpty(this.state)) {
      this.setState({ loading: true });
      createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: this.state.userName,
          })
            .then(() => {
              this.writeUserData(userCredential);
            })
            .then(() => {
              this.setState({ userName: "" });
              this.setState({ email: "" });
              this.setState({ password: "" });
              this.setState({ confirmPassword: "" });
              this.setState({ loading: false });
              this.setState({ errorMsg: "" });
              this.setState({ succMsg: "Your Account Create Successfull" });
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("email-already")) {
            this.setState({ errorMsg: "This email already in use" });
          }
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

  writeUserData = (user) => {
    const db = getDatabase();
    set(ref(db, "users/" + user.user.uid), {
      username: this.state.userName,
      email: this.state.email,
    });
  };

  writeGoogleUserData = (user) => {
    const db = getDatabase();
    set(ref(db, "users/" + user.user.uid), {
      username: user.user.displayName,
      email: user.user.email,
    });
  };

  isEmpty = ({ userName, email, password, confirmPassword }) => {
    if (!userName.length && !email.length && !password.length && !confirmPassword.length) {
      this.setState({ errorMsg: "Please enter the all field" });
    } else if (!userName.length) {
      this.setState({ errorMsg: "Enter your UserName" });
    } else if (!email.length) {
      this.setState({ errorMsg: "Enter your email" });
    } else if (!password.length) {
      this.setState({ errorMsg: "Enter your password" });
    } else if (!confirmPassword.length) {
      this.setState({ errorMsg: "Enter your confirmpassowrd" });
    } else if (password.length < 8 || confirmPassword.length < 8) {
      this.setState({ errorMsg: "Password should be at least 8 letter" });
    } else if (password !== confirmPassword) {
      this.setState({ errorMsg: "Password did not match" });
    } else {
      return true;
    }
  };

  render() {
    const { userName, email, password, confirmPassword, loading, errorMsg, succMsg } = this.state;
    return (
      <>
        <div className="register" style={{ marginTop: "30px" }}>
          <Container>
            <Row>
              <Col lg={6}>
                {" "}
                <div className="register_img">
                  <img src={chatImg} style={{ width: "90%" }} alt="" />
                </div>
              </Col>
              <Col lg={5}>
                <div className="register_form" style={{ marginTop: "30px" }}>
                  <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Create Your Account</h1>

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
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        name="userName"
                        type="text"
                        onChange={this.handleChange}
                        placeholder="User Name"
                        value={userName}
                        required
                      />
                    </Form.Group>

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
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        name="confirmPassword"
                        onChange={this.handleChange}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                      />
                    </Form.Group>
                    <Button onClick={this.handleSubmit} style={{ width: "100%", background: "#0c316e" }}>
                      {loading ? <Spinner animation="border" size="sm" disabled /> : "SUBMIT"}
                    </Button>
                  </Form>
                  <p style={{ textAlign: "center", marginTop: "10px", fontWeight: "600" }}>
                    Already Have An Account?
                    <Link style={{ textDecoration: "none" }} to="/login">
                      {"  "}
                      Log In
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
                  {succMsg ? (
                    <p
                      style={{
                        border: "1px solid gray",
                        borderRadius: "5px",
                        padding: "8px 0px",
                        textAlign: "center",
                        color: "green",
                        fontSize: "18px",
                      }}
                    >
                      {succMsg}
                    </p>
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
