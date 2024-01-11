export default {
  authUser: (state, getters) => {
    return getters.user(state.authId);
  },
};
