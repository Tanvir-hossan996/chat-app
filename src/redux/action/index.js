import * as actionType from "./type";

export const setUser = (user) => {
  return {
    type: actionType.SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const clearUser = () => {
  return {
    type: actionType.CLEAR_USER,
  };
};

export const setGroup = (group) => {
  return {
    type: actionType.SET_GROUP,
    payload: {
      currentGroup: group,
    },
  };
};

export const setFriend = (friend) => {
  return {
    type: actionType.SET_FRIEND,
    payload: {
      currentFriend: friend,
    },
  };
};

export const activeGroup = (activeGroup) => {
  return {
    type: actionType.ACTIVE_GROUP,
    payload: {
      activeGroup: activeGroup,
    },
  };
};

export const emptyGroup = (emptyGroup) => {
  return {
    type: actionType.EMPTY_GROUP,
    payload: {
      emptyGroup: emptyGroup,
    },
  };
};
