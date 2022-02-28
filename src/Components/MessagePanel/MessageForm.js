import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { AiOutlineSend } from "react-icons/ai";
import { GoFileMedia } from "react-icons/go";
import { getDatabase, ref, push, set, child } from "../../firebase-config";
import MediaModal from "./MediaModal";

export default class MessageForm extends Component {
  state = {
    msg: "",
    errorMsg: "",
    modal: false,
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleSubmit = () => {
    if (this.state.msg) {
      const db = getDatabase();
      const messageRef = ref(db, "message");
      const newMessageRef = push(child(messageRef, `${this.props.currentgroup.Id}`));
      set(newMessageRef, {
        userName: this.props.currentuser.displayName,
        msg: this.state.msg,
        date: Date(),
        sender: this.props.currentuser.uid,
        groupId: this.props.currentgroup.Id,
      }).then(() => {
        this.setState({ errorMsg: "" });
        this.setState({ msg: "" });
      });
    } else {
      this.setState({ errorMsg: "message nai" });
    }
  };

  render() {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d1d1d1",
            paddingTop: "10px",
          }}
        >
          <Button onClick={this.openModal} style={{ width: "38px", height: "38px", padding: "0px" }} variant="outline-dark">
            <GoFileMedia style={{ fontSize: "20px" }} />
          </Button>
          <Form.Group style={{ width: "86%" }} className="mb-3" controlId="formBasicEmail">
            <Form.Control
              onChange={(e) => this.setState({ msg: e.target.value })}
              value={this.state.msg}
              type="text"
              placeholder="Aa..."
              style={this.state.errorMsg.includes("message nai") ? styleError : noneError}
            />
          </Form.Group>
          <Button style={{ width: "38px", height: "38px", padding: "0px" }} variant="outline-primary" onClick={this.handleSubmit}>
            <AiOutlineSend style={{ fontSize: "20px" }} />
          </Button>
        </div>
        <MediaModal
          currentgroup={this.props.currentgroup}
          currentuser={this.props.currentuser}
          modal={this.state.modal}
          closeModal={this.closeModal}
        />
      </>
    );
  }
}

let styleError = {
  borderColor: "#f20202",
};

let noneError = {
  borderColor: "#ced4da",
};
