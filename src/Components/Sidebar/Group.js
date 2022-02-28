import React, { Component } from "react";
import { Modal, Button, Form, Spinner, ListGroup } from "react-bootstrap";
import { IoCreateOutline } from "react-icons/io5";
import { getDatabase, ref, push, set, onValue } from "../../firebase-config";
import { VscChromeClose } from "react-icons/vsc";
import { connect } from "react-redux";
import { setGroup, setFriend, activeGroup, emptyGroup } from "../../redux/action/index";

class Group extends Component {
  state = {
    modal: false,
    groupName: "",
    groupTagline: "",
    errorMsg: "",
    loading: false,
    groups: [],
    activeGroup: "",
    firstLoad: true,
    searchTerm: "",
    groupSearchName: [],
    users: [],
    activeFriend: "",
    userSearchTerm: "",
    userSearchResult: [],
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isEmpty(this.state)) {
      this.setState({ loading: true });
      const db = getDatabase();
      const groupRef = ref(db, "groups");
      const newGroupRef = push(groupRef);
      set(newGroupRef, {
        CreatedBy: this.props.currentuser.displayName,
        GroupName: this.state.groupName,
        GroupTagline: this.state.groupTagline,
        date: Date(),
      }).then(() => {
        this.setState({ groupName: "" });
        this.setState({ groupTagline: "" });
        this.setState({ errorMsg: "" });
        this.setState({ loading: false });
        this.closeModal();
      });
    }
  };

  isEmpty = ({ groupName, groupTagline }) => {
    if (!groupName.length && !groupTagline.length) {
      this.setState({ errorMsg: "Please enter the all field" });
    } else if (!groupName.length) {
      this.setState({ errorMsg: "Enter your Group Name" });
    } else if (!groupTagline.length) {
      this.setState({ errorMsg: "Enter your Group Tagline" });
    } else {
      return true;
    }
  };

  componentDidMount() {
    let groupArr = [];
    const db = getDatabase();
    const starCountRef = ref(db, "groups/");
    onValue(starCountRef, (snapshot) => {
      groupArr = [];
      snapshot.forEach((item) => {
        let groupData = {
          CreatedBy: item.val().CreatedBy,
          GroupName: item.val().GroupName,
          GroupTagline: item.val().GroupTagline,
          Id: item.key,
          date: item.val().date,
        };
        groupArr.push(groupData);
      });

      this.setState({ groups: groupArr }, this.AddGrouponLoad);
    });

    ///// Group Coding Start////

    //// User coding start///
    let userArr = [];
    const starUserRef = ref(db, "users/");
    onValue(starUserRef, (snapshot) => {
      userArr = [];
      snapshot.forEach((item) => {
        let userData = {
          username: item.val().username,
          email: item.val().email,
          userId: item.key,
        };
        userArr.push(userData);
      });
      this.setState({ users: userArr });
    });
  }

  AddGrouponLoad = () => {
    let firstGroup = this.state.groups[0];
    if (this.state.firstLoad && this.state.groups.length > 0) {
      this.props.setGroup(firstGroup);
      this.setState({ activeGroup: firstGroup.Id }, () => this.props.activeGroup(this.state.activeGroup));
    }

    this.setState({ firstLoad: false });
  };

  groupChange = (group) => {
    this.props.setGroup(group);
    this.setState({ activeGroup: group.Id }, () => this.props.activeGroup(this.state.activeGroup));
    this.setState({ activeFriend: "" });
    // console.log(group);
  };

  // for groupName search

  handleChangeSearch = (e) => {
    this.setState({ searchTerm: e.target.value }, () => this.searchGroup());
  };

  searchGroup = () => {
    let groupSearch = [...this.state.groups];
    let regex = RegExp(this.state.searchTerm, "gi");
    let groupSearchName = groupSearch.reduce((initailGroup, group) => {
      if (group.GroupName && group.GroupName.match(regex)) {
        initailGroup.push(group);
      }
      return initailGroup;
    }, []);
    this.setState({ groupSearchName: groupSearchName });
  };

  ///////// Group coding end//////////

  //////// User Coding start//////////

  userChange = (friend) => {
    this.setState({ activeFriend: friend.userId });
    this.props.setFriend(friend);
    this.setState({ activeGroup: "" }, () => this.props.emptyGroup(this.state.emptyGroup));
  };

  // user Name Search

  handleUserSearch = (e) => {
    this.setState({ userSearchTerm: e.target.value }, () => this.handleUserSearchName());
  };

  handleUserSearchName = () => {
    let userName = [...this.state.users];
    let regex = RegExp(this.state.userSearchTerm, "gi");
    let userSearchResult = userName.reduce((initial, user) => {
      if (user.username && user.username.match(regex)) {
        initial.push(user);
      }
      return initial;
    }, []);
    this.setState({ userSearchResult: userSearchResult });
  };

  render() {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3>Group ({this.state.groups.length})</h3>
          <IoCreateOutline onClick={this.openModal} style={{ fontSize: "36px", cursor: "pointer" }} />
        </div>
        <div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control style={{ width: "100%" }} type="search" onChange={this.handleChangeSearch} placeholder="Search" />
          </Form.Group>
        </div>
        {this.state.searchTerm ? (
          <ListGroup style={{ height: "135px", overflowY: "scroll", padding: "0px 5px 0px 13px" }}>
            {this.state.groupSearchName.map((item, pera) => (
              <div key={pera}>
                <ListGroup.Item
                  style={item.Id === this.state.activeGroup ? listActive : list}
                  onClick={() => this.groupChange(item)}
                >
                  {item.GroupName}
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        ) : (
          <ListGroup style={{ height: "135px", overflowY: "scroll", padding: "0px 5px 0px 13px" }}>
            {this.state.groups.map((item, pera) => (
              <div key={pera}>
                <ListGroup.Item
                  style={item.Id === this.state.activeGroup ? listActive : list}
                  onClick={() => this.groupChange(item)}
                >
                  {item.GroupName}
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        )}
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
            <Modal.Title style={{ fontWeight: "700", fontSize: "40px" }}>CREATE GROUP</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ border: "none" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  name="groupName"
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Group Name"
                  value={this.state.groupName}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Group Tagline</Form.Label>
                <Form.Control
                  name="groupTagline"
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Group Tagline"
                  value={this.state.groupTagline}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "flex-start", border: "none", paddingTop: "0px" }}>
            <Button
              style={{ width: "70%", marginLeft: "15%", background: "#0c316e" }}
              variant="primary"
              onClick={this.handleSubmit}
            >
              {this.state.loading ? <Spinner animation="border" size="sm" /> : "Add Group"}
            </Button>

            {this.state.errorMsg ? (
              <button
                style={{
                  width: "100%",
                  background: "#FFF6F6",
                  border: "1px solid #912D2B",
                  color: "#912D2B",
                  padding: "8px 0px",
                  fontSize: "18px",
                  fontWeight: "500",
                  borderRadius: "5px",
                  marginTop: "15px",
                }}
              >
                {this.state.errorMsg}
              </button>
            ) : (
              ""
            )}
          </Modal.Footer>
        </Modal>
        <div style={{ paddingTop: "15px" }}>
          <h3>User ({this.state.users.length}) </h3>
          <div>
            <Form.Group className="mb-3">
              <Form.Control style={{ width: "100%" }} type="search" placeholder="Search" onChange={this.handleUserSearch} />
            </Form.Group>
          </div>
          {this.state.userSearchTerm ? (
            <ListGroup style={{ overflowY: "scroll", height: "250px" }}>
              {this.state.userSearchResult.map((item, pera) => (
                <div key={pera}>
                  <ListGroup.Item
                    style={this.state.activeFriend === item.userId ? listActive : list}
                    onClick={() => this.userChange(item)}
                  >
                    {item.username}
                  </ListGroup.Item>
                </div>
              ))}
            </ListGroup>
          ) : (
            <ListGroup style={{ overflowY: "scroll", height: "250px" }}>
              {this.state.users.map((item, pera) => (
                <div key={pera}>
                  <ListGroup.Item
                    style={this.state.activeFriend === item.userId ? listActive : list}
                    onClick={() => this.userChange(item)}
                  >
                    {item.username}
                  </ListGroup.Item>
                </div>
              ))}
            </ListGroup>
          )}
        </div>
      </>
    );
  }
}

let listActive = {
  background: "#d1d1d1",
  cursor: "pointer",
};

let list = {
  background: "white",
  cursor: "pointer",
};

export default connect(null, { setGroup, setFriend, activeGroup, emptyGroup })(Group);
