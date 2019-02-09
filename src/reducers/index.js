import { combineReducers } from 'redux';
// import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router'

import posprinter from './posprinter';

export default (history)=>combineReducers(
  {
    posprinter,
    // form: formReducer,
    router: connectRouter(history),
  });
