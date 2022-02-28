import React, { Component } from "react";
import { Form } from "react-bootstrap";

export default class UserMessageHeader extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #d1d1d1",
          alignItems: "center",
        }}
      >
        <div>{this.props.currentfriend ? <h3>{this.props.currentfriend.username}</h3> : ""}</div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="search" placeholder="Search" onChange={this.props.handleSearchUserMsg} />
        </Form.Group>
      </div>
    );
  }
}
