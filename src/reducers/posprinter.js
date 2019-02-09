import { createReducer } from 'redux-act';
import {
    posprinter_savetemplate,
} from '../actions/index.js';
// import moment from 'moment';

const initial = {
    posprinter: {
    },

};

const posprinter = createReducer({
    [posprinter_savetemplate]: (state, payload) => {
        return { ...state, ...payload };
    },
}, initial.posprinter);

export default posprinter;
