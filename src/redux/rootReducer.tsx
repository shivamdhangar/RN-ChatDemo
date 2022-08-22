import {combineReducers} from 'redux';
import HomeReducer from './home/reducer';
const rootReducer = combineReducers({
  HomeReducer,
});
export default rootReducer;
