import moment from "moment";
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";

export default class MetaPanel extends Component {
  render() {
    return (
      <>
        {this.props.activegroup ? (
          <ListGroup
            style={{
              border: "1px solid black",
              width: "100%",
              height: "100vh",
              padding: "20px 20px 0px 20px",
              background: "#2c4061",
              color: "white",
            }}
          >
            {this.props.currentgroup ? <ListGroup.Item>Group Name : {this.props.currentgroup.GroupName}</ListGroup.Item> : ""}
            {this.props.currentgroup ? <ListGroup.Item>Created By : {this.props.currentgroup.CreatedBy}</ListGroup.Item> : ""}
            {this.props.currentgroup ? (
              <ListGroup.Item>Created Time : {moment(this.props.currentgroup.date).fromNow()}</ListGroup.Item>
            ) : (
              ""
            )}
          </ListGroup>
        ) : (
          <ListGroup
            style={{
              border: "1px solid black",
              width: "100%",
              height: "100vh",
              padding: "20px 20px 0px 20px",
              background: "#2c4061",
              color: "white",
            }}
          >
            {this.props.currentfriend ? <ListGroup.Item>User Name : {this.props.currentfriend.username}</ListGroup.Item> : ""}
          </ListGroup>
        )}
      </>
    );
  }
}
