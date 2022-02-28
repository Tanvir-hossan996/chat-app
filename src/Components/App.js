import { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../firebase-config";
import { setUser, clearUser } from "../redux/action/index";
import Color from "./ColorPlate/Color";
import MessagePanel from "./MessagePanel/MessagePanel";
import MetaPanel from "./MetaPanle/MetaPanel";
import Sidebar from "./Sidebar/Sidebar";

class App extends Component {
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
      } else {
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <h1>Loading</h1>
    ) : (
      <>
        <div className="App">
          <div className="App_container" style={{ width: "100%", display: "flex" }}>
            <div style={{ width: "5%" }}>
              <Color />
            </div>
            <div style={{ width: "20%" }}>
              <Sidebar currentuser={this.props.currentUser} />
            </div>
            <div style={{ width: "55%" }}>
              <MessagePanel
                currentfriend={this.props.currentFriend}
                currentgroup={this.props.currentGroup}
                currentuser={this.props.currentUser}
                activegroup={this.props.activeGroup}
              />
            </div>
            <div style={{ width: "20%" }}>
              <MetaPanel
                currentgroup={this.props.currentGroup}
                currentfriend={this.props.currentFriend}
                activegroup={this.props.activeGroup}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
  currentUser: state.user.currentUser,
  currentGroup: state.group.currentGroup,
  currentFriend: state.friend.currentFriend,
  activeGroup: state.activeGroup.activeGroup,
});

export default connect(mapStateToProps, { setUser, clearUser })(App);
