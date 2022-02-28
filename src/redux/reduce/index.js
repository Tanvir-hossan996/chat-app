import { combineReducers } from "redux";
import * as actionType from "../action/type";

const initialUser = {
  currentUser: null,
  isLoading: true,
};

const user_reducer = (state = initialUser, action) => {
  switch (action.type) {
    case actionType.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false,
      };

    case actionType.CLEAR_USER:
      return {
        ...initialUser,
      };

    default:
      return state;
  }
};

let initialGroup = {
  currentGroup: null,
};

const group_reducer = (state = initialGroup, action) => {
  switch (action.type) {
    case actionType.SET_GROUP:
      return {
        currentGroup: action.payload.currentGroup,
      };

    default:
      return state;
  }
};

let initialFriend = {
  currentFriend: null,
};

const friend_reducer = (state = initialFriend, action) => {
  switch (action.type) {
    case actionType.SET_FRIEND:
      return {
        currentFriend: action.payload.currentFriend,
      };

    default:
      return state;
  }
};

let initialActiveGroup = {
  activeGroup: null,
};

const activegroup_reducer = (state = initialActiveGroup, action) => {
  switch (action.type) {
    case actionType.ACTIVE_GROUP:
      return {
        activeGroup: action.payload.activeGroup,
      };

    case actionType.EMPTY_GROUP:
      return {
        emptyGroup: action.payload.emptyGroup,
      };

    default:
      return state;
  }
};

export const root_reducer = combineReducers({
  user: user_reducer,
  group: group_reducer,
  friend: friend_reducer,
  activeGroup: activegroup_reducer,
});
