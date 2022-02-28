import React, { Component } from "react";
import { Form } from "react-bootstrap";
export default class MessageHeader extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #d1d1d1",
        }}
      >
        <div>
          {this.props.currentgroup ? <h3>{this.props.currentgroup.GroupName}</h3> : ""}
          {this.props.totalUser.length > 1 ? (
            <h5>{this.props.totalUser.length} Users</h5>
          ) : (
            <h5>{this.props.totalUser.length} User</h5>
          )}
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="search" placeholder="Search" onChange={this.props.handleSearch} />
        </Form.Group>
      </div>
    );
  }
}
