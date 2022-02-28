import React, { Component } from "react";
import { Row } from "react-bootstrap";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";
import { getDatabase, ref, onChildAdded } from "../../firebase-config";
import moment from "moment";
import UserMessageForm from "./UserMessageForm";
import { onChildChanged } from "firebase/database";
import UserMessageHeader from "./UserMessageHeader";

export default class MessagePanel extends Component {
  state = {
    groupMsg: [],
    groupsMedia: [],
    totalUser: [],
    searchTerm: "",
    messageResult: [],
    userMsg: [],
    userMsgState: true,
    searchTermUserMsg: "",
    userMessageSearchResult: [],
  };

  componentDidUpdate(previousProps) {
    let groupMsgArr = [];
    let groupsFilesArr = [];
    let totalUserArr = [];

    const db = getDatabase();
    const commentsRef = ref(db, "message/" + this.props.currentgroup.Id);

    // This onChildAdded for msg
    onChildAdded(commentsRef, (data) => {
      groupMsgArr.push(data.val());

      if (totalUserArr.indexOf(data.val().sender) === -1 && data.val().groupId === this.props.currentgroup.Id) {
        totalUserArr.push(data.val().sender);
      }

      if (previousProps.currentgroup) {
        if (previousProps.currentgroup.Id !== this.props.currentgroup.Id) {
          this.setState({ groupMsg: groupMsgArr });
          this.setState({ totalUser: totalUserArr });
        }
      } else {
        this.setState({ groupMsg: groupMsgArr });
        this.setState({ totalUser: totalUserArr });
      }
    });

    // This onChildAdded for Img
    const filesRef = ref(db, "files/" + this.props.currentgroup.Id);
    onChildAdded(filesRef, (data) => {
      groupsFilesArr.push(data.val());
      if (totalUserArr.indexOf(data.val().sender) === -1 && data.val().groupId === this.props.currentgroup.Id) {
        totalUserArr.push(data.val().sender);
      }
      if (previousProps.currentgroup) {
        if (previousProps.currentgroup.Id !== this.props.currentgroup.Id) {
          this.setState({ groupsMedia: groupsFilesArr });
          this.setState({ totalUser: totalUserArr });
        }
      } else {
        this.setState({ groupsMedia: groupsFilesArr });
        this.setState({ totalUser: totalUserArr });
      }
    });

    //// start user message show here ////

    let userMsgArr = [];

    const userMessageRef = ref(db, "userMessage/");
    onChildAdded(userMessageRef, (data) => {
      data.forEach((item) => {
        userMsgArr.push(item.val());
      });
      if (previousProps.currentfriend) {
        if (previousProps.currentfriend.userId !== this.props.currentfriend.userId) {
          this.setState({ userMsg: userMsgArr });
        } else if (this.state.userMsgState) {
          this.setState({ userMsg: userMsgArr });
          this.setState({ userMsgState: false });
        }
      }
    });
    onChildChanged(userMessageRef, (data) => {
      userMsgArr = [];
      data.forEach((item) => {
        userMsgArr.push(item.val());
        console.log(item.val());
      });
      if (previousProps.currentfriend) {
        if (previousProps.currentfriend.userId !== this.props.currentfriend.userId) {
          this.setState({ userMsg: userMsgArr });
        } else if (this.state.userMsgState) {
          this.setState({ userMsg: userMsgArr });
          this.setState({ userMsgState: false });
        }
      }
    });
  }

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value }, () => this.handleMessageSearch());
  };

  handleSearchUserMsg = (e) => {
    this.setState({ searchTermUserMsg: e.target.value }, () => this.userMessageSearch());
  };

  userMessageSearch = () => {
    let userMsg = [...this.state.userMsg];
    let regexp = RegExp(this.state.searchTermUserMsg, "gi");
    let userMessageSearchResult = userMsg.reduce((initial, message) => {
      if (message.userMsg && message.userMsg.match(regexp)) {
        initial.push(message);
      }
      return initial;
    }, []);
    this.setState({ userMessageSearchResult: userMessageSearchResult });
    console.log(this.state.userMessageSearchResult);
  };

  handleMessageSearch = () => {
    let groupMsg = [...this.state.groupMsg];
    let regex = RegExp(this.state.searchTerm, "gi");
    let messageResult = groupMsg.reduce((initial, message) => {
      if (message.msg && message.msg.match(regex)) {
        initial.push(message);
      }
      return initial;
    }, []);
    this.setState({ messageResult: messageResult });
  };

  render() {
    return (
      <div style={{ height: "100vh", border: "1px solid gray", borderBottom: "none", padding: "10px 15px 0px" }}>
        {this.props.activegroup ? (
          <Row style={{ height: "10%" }}>
            <MessageHeader
              handleSearch={this.handleSearch}
              currentgroup={this.props.currentgroup}
              totalUser={this.state.totalUser}
            />
          </Row>
        ) : (
          <Row style={{ height: "10%" }}>
            <UserMessageHeader currentfriend={this.props.currentfriend} handleSearchUserMsg={this.handleSearchUserMsg} />
          </Row>
        )}
        {this.props.activegroup ? (
          <Row style={{ height: "81%", overflowY: "scroll" }}>
            <div className="group_msg" style={{ paddingTop: "8px" }}>
              {this.state.searchTerm
                ? this.state.messageResult.map((item, pera) =>
                    this.props.currentgroup.Id === item.groupId ? (
                      <div
                        key={pera}
                        className="comment"
                        style={item.sender === this.props.currentuser.uid ? flexEnd : flexStart}
                      >
                        <h6 className="comment_author" style={{ fontSize: "14px" }}>
                          {item.userName}
                        </h6>
                        <div>
                          <p
                            className="comment_msg"
                            style={{
                              background: "#d1d1d1",
                              display: "inline",
                              fontSize: "18px",
                              padding: "5px 10px",
                              borderRadius: "18px",
                              margin: "3px 0px",
                            }}
                          >
                            {item.msg}
                          </p>
                        </div>
                        <p style={{ fontSize: "12px", marginTop: "5px" }} className="comment_time">
                          {moment(item.date).fromNow()}{" "}
                        </p>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : this.state.groupMsg.map((item, pera) =>
                    this.props.currentgroup.Id === item.groupId ? (
                      <div
                        key={pera}
                        className="comment"
                        style={item.sender === this.props.currentuser.uid ? flexEnd : flexStart}
                      >
                        <h6 className="comment_author" style={{ fontSize: "14px" }}>
                          {item.userName}
                        </h6>
                        <div>
                          <p
                            className="comment_msg"
                            style={{
                              background: "#d1d1d1",
                              display: "inline",
                              fontSize: "18px",
                              padding: "5px 10px",
                              borderRadius: "18px",
                              margin: "3px 0px",
                            }}
                          >
                            {item.msg}
                          </p>
                        </div>
                        <p style={{ fontSize: "12px", marginTop: "5px" }} className="comment_time">
                          {moment(item.date).fromNow()}{" "}
                        </p>
                      </div>
                    ) : (
                      ""
                    )
                  )}
              {this.state.groupsMedia.map((item, pera) =>
                this.props.currentgroup.Id === item.groupId ? (
                  <div key={pera} className="comment" style={item.sender === this.props.currentuser.uid ? flexEnd : flexStart}>
                    <h6 className="comment_author" style={{ fontSize: "14px" }}>
                      {item.userName}
                    </h6>
                    <div>
                      <img style={{ width: "20%" }} src={item.UrlLink} alt="" />
                    </div>
                    <p style={{ fontSize: "12px", marginTop: "5px" }} className="comment_time">
                      {moment(item.date).fromNow()}{" "}
                    </p>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </Row>
        ) : (
          <Row style={{ height: "81%", overflowY: "scroll" }}>
            <div className="group_msg" style={{ paddingTop: "8px" }}>
              {this.state.searchTermUserMsg
                ? this.state.userMessageSearchResult.map((item, pera) =>
                    item.frienduserId === this.props.currentfriend.userId ? (
                      <div
                        key={pera}
                        className="comment"
                        style={item.sender === this.props.currentuser.uid ? flexEnd : flexStart}
                      >
                        <h6 className="comment_author" style={{ fontSize: "14px" }}>
                          {item.userName}
                        </h6>
                        <div>
                          <p
                            className="comment_msg"
                            style={{
                              background: "#d1d1d1",
                              display: "inline",
                              fontSize: "18px",
                              padding: "5px 10px",
                              borderRadius: "18px",
                              margin: "3px 0px",
                            }}
                          >
                            {item.userMsg}
                          </p>
                        </div>
                        <p style={{ fontSize: "12px", marginTop: "5px" }} className="comment_time">
                          {moment(item.date).fromNow()}{" "}
                        </p>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : this.state.userMsg.map((item, pera) =>
                    item.frienduserId === this.props.currentfriend.userId ? (
                      <div
                        key={pera}
                        className="comment"
                        style={item.sender === this.props.currentuser.uid ? flexEnd : flexStart}
                      >
                        <h6 className="comment_author" style={{ fontSize: "14px" }}>
                          {item.userName}
                        </h6>
                        <div>
                          <p
                            className="comment_msg"
                            style={{
                              background: "#d1d1d1",
                              display: "inline",
                              fontSize: "18px",
                              padding: "5px 10px",
                              borderRadius: "18px",
                              margin: "3px 0px",
                            }}
                          >
                            {item.userMsg}
                          </p>
                        </div>
                        <p style={{ fontSize: "12px", marginTop: "5px" }} className="comment_time">
                          {moment(item.date).fromNow()}{" "}
                        </p>
                      </div>
                    ) : (
                      ""
                    )
                  )}
            </div>
          </Row>
        )}
        {this.props.activegroup ? (
          <Row style={{ height: "9%" }}>
            <MessageForm currentgroup={this.props.currentgroup} currentuser={this.props.currentuser} />
          </Row>
        ) : (
          <UserMessageForm currentuser={this.props.currentuser} currentfriend={this.props.currentfriend} />
        )}
      </div>
    );
  }
}

let flexEnd = {
  textAlign: "right",
};

let flexStart = {
  textAlign: "left",
};
