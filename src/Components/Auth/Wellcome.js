import React, { Component } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import socialImg from "../../Images/welcome-img.png";

export default class Wellcome extends Component {
  render() {
    return (
      <div className="wellcome">
        <Container>
          <Row>
            <Col lg={5}>
              <div className="wellcome_content" style={{ marginTop: "180px" }}>
                <h1 style={{ fontSize: "60px", fontWeight: "700", color: "#0c316e" }}>Wellcome to WeChat</h1>
                <p style={{ fontSize: "22px", fontWeight: "400", color: "#0c316e", marginBottom: "30px" }}>
                  WeChat makes it easy and fun to stay close to your favorite people.
                </p>
                <Link style={{ textDecoration: "none" }} to="/login">
                  <Button style={{ marginRight: "5px" }} variant="outline-primary">
                    {" "}
                    Login
                  </Button>{" "}
                </Link>
                <Link style={{ textDecoration: "none" }} to="/register">
                  <Button style={{ marginRight: "5px" }} variant="outline-dark">
                    {" "}
                    Sign Up
                  </Button>{" "}
                </Link>
              </div>
            </Col>
            <Col lg={7}>
              <div className="wellcome_img">
                <Image src={socialImg} style={{ width: "100%" }} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
