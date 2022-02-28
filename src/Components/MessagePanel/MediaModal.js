import React, { Component } from "react";
import { Modal, Button, Form, ProgressBar, Spinner } from "react-bootstrap";
import { VscChromeClose } from "react-icons/vsc";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as refer, push, set, child } from "../../firebase-config";
export default class MediaModal extends Component {
  state = {
    files: "",
    progress: "",
    loading: false,
  };

  handleChange = (e) => {
    this.setState({ files: e.target.files[0] });
  };

  handleSubmit = () => {
    if (this.state.files) {
      this.setState({ loading: true });
      const storage = getStorage();
      const storageRef = ref(storage, `files/${this.state.files.name}`);
      const uploadTask = uploadBytesResumable(storageRef, this.state.files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.setState({ progress: progress });
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            const db = getDatabase();
            const fileRef = refer(db, "files");
            const newFileRef = push(child(fileRef, `${this.props.currentgroup.Id}`));
            set(newFileRef, {
              userName: this.props.currentuser.displayName,
              UrlLink: url,
              date: Date(),
              sender: this.props.currentuser.uid,
              groupId: this.props.currentgroup.Id,
            }).then(() => {
              this.props.closeModal();
              this.setState({ progress: "" });
              this.setState({ files: "" });
              this.setState({ loading: false });
            });
          });
        }
      );
    } else {
      console.log("file nai");
    }
  };

  render() {
    return (
      <>
        <Modal show={this.props.modal} centered>
          <VscChromeClose
            onClick={this.props.closeModal}
            style={{ fontSize: "30px", cursor: "pointer", marginLeft: "93%", marginTop: "4px" }}
          />
          <Modal.Header
            style={{
              border: "none",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px",
            }}
          >
            <Modal.Title style={{ fontWeight: "700", fontSize: "26px" }}>Choose Photo</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ border: "none" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control name="groupName" type="file" onChange={this.handleChange} />
              </Form.Group>
            </Form>
            <div>
              {this.state.progress ? (
                <ProgressBar
                  style={{ display: "inline-block", width: "100%" }}
                  now={this.state.progress}
                  label={`${this.state.progress}%`}
                />
              ) : (
                ""
              )}
            </div>
          </Modal.Body>

          <Modal.Footer style={{ justifyContent: "flex-start", border: "none", paddingTop: "0px" }}>
            <Button
              style={{ width: "60%", marginLeft: "20%", background: "#0c316e" }}
              variant="primary"
              onClick={this.handleSubmit}
            >
              {this.state.loading ? <Spinner animation="border" size="sm" /> : "Upload"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
