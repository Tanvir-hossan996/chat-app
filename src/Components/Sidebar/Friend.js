import React, { Component } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { ListGroup } from "react-bootstrap";

export default class Friend extends Component {
  state = {
    users: [],
    activeUser: "",
  };

  componentDidMount() {
    const db = getDatabase();
    let userArr = [];
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
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

  userChange = (user) => {
    this.setState({ active: user.userId });
    // console.log(user.userId);
    // console.log(this.state.active);
  };

  render() {
    return (
      <div style={{ paddingTop: "15px" }}>
        <h3>User</h3>
        <ListGroup style={{ overflowY: "scroll", height: "350px" }}>
          {this.state.users.map((item, pera) => (
            <div key={pera}>
              <ListGroup.Item style={this.state.active === item.userId ? listActive : list} onClick={() => this.userChange(item)}>
                {item.username}
              </ListGroup.Item>
            </div>
          ))}
        </ListGroup>
      </div>
    );
  }
}

let listActive = {
  cursor: "pointer",
  background: "#d1d1d1",
};

let list = {
  cursor: "pointer",
  background: "white",
};
