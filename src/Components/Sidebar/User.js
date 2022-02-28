import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { auth, signOut } from "../../firebase-config";
import { Modal, Button, Form, ProgressBar, Spinner } from "react-bootstrap";
import { VscChromeClose } from "react-icons/vsc";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as refer, set, child, onChildAdded } from "../../firebase-config";

export default class User extends Component {
  state = {
    modal: false,
    proPhoto: "",
    progress: "",
    uploadPhoto: [],
    uploadP: true,
    loading: false,
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleChange = (e) => {
    this.setState({ proPhoto: e.target.files[0] });
  };

  handleSubmit = () => {
    if (this.state.proPhoto) {
      this.setState({ loading: true });
      let storage = getStorage();
      let storageRef = ref(storage, `profilePhoto/${this.state.proPhoto.name}`);
      let uploadTask = uploadBytesResumable(storageRef, this.state.proPhoto);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.setState({ progress: progress });
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((UrlLink) => {
            const db = getDatabase();
            const fileRef = refer(db, "profilePhoto");
            const newFileRef = child(fileRef, `${this.props.currentuser.uid}`);
            set(newFileRef, {
              userName: this.props.currentuser.displayName,
              UrlLink: UrlLink,
              userId: this.props.currentuser.uid,
            }).then(() => {
              this.setState({ modal: false });
              this.setState({ progress: "" });
              this.setState({ proPhoto: "" });
              this.setState({ uploadP: true });
              this.setState({ loading: false });
            });
          });
        }
      );
    } else {
      console.log("photo nai");
    }
  };

  componentDidUpdate() {
    const db = getDatabase();
    let uploadPhotoArr = [];
    const commentsRef = refer(db, "profilePhoto/");
    onChildAdded(commentsRef, (data) => {
      uploadPhotoArr.push(data.val());
      if (this.state.uploadP) {
        this.setState({ uploadPhoto: uploadPhotoArr });
        this.setState({ uploadP: false });
      }
    });
  }

  handleOut = () => {
    signOut(auth)
      .then(() => {
        // log out
      })
      .catch((error) => {
        // error
      });
  };

  render() {
    return (
      <div className="sidebar-user" style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "200px" }}>
          {this.state.uploadPhoto.map((item, pera) =>
            item.userId === this.props.currentuser.uid ? (
              <img key={pera} src={item.UrlLink} style={{ width: "60px", height: "60px", borderRadius: "100%" }} alt="" />
            ) : (
              ""
            )
          )}

          <p style={{ paddingTop: "5px" }}>{this.props.currentuser.displayName}</p>
        </div>
        <Dropdown>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "gray",
              border: "none",
              boxShadow: "none",
            }}
          ></Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={this.openModal}>Upload & Change profile</Dropdown.Item>

            <Dropdown.Item onClick={this.handleOut}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Modal show={this.state.modal} centered>
          <VscChromeClose
            onClick={this.closeModal}
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
            <Modal.Title style={{ fontWeight: "700", fontSize: "26px" }}>Choose your proifle picture</Modal.Title>
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
      </div>
    );
  }
}
