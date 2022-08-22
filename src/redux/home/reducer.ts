const initialState = {
  users: {},
};
const HomeReducer = (state = initialState, action: any) => {
  const {type, payload} = action;
  switch (type) {
    case 'SET_USER':
      return {...state, users: payload};
    default:
      return state;
  }
};
export default HomeReducer;
