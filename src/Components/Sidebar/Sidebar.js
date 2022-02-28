import React, { Component } from "react";
import { Row } from "react-bootstrap";
import Group from "./Group";
import User from "./User";

export default class Sidebar extends Component {
  render() {
    return (
      <div
        className="Sidebar"
        style={{
          border: "1px solid black",
          width: "100%",
          height: "100vh",
          padding: "20px 20px 0px 20px",
          background: "#2c4061",
          color: "white",
        }}
      >
        <Row>
          <User currentuser={this.props.currentuser} />
          <Group currentuser={this.props.currentuser} />
        </Row>
      </div>
    );
  }
}
