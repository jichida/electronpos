import { createReducer } from 'redux-act';
import {
    posprinter_savetemplate,
} from '../actions/index.js';
// import moment from 'moment';

const initial = {
    posprinter: {
       groupnodes:{
          '二维码': { height: 130, id: "二维码", type: "Path", width: 130, x: 200, y: 140 },
          '会员价': {
              fontSize: 12,
              id: "会员价",
              text: "会员价",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 125,
              y: 120
          },
          '店名': {
              fontSize: 12,
              id: "单位",
              text: "单位",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 180,
              y: 20,
          },
          '原价': {
              fontSize: 12,
              id: "原价",
              text: "原价",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 0,
              y: 120,
          },
          '品名': {
              fontSize: 12,
              id: "品名",
              text: "品名",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 0,
              y: 80,
          },
          '折扣价': {
              fontSize: 12,
              id: "折扣价",
              text: "折扣价",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 250,
              y: 120,
          },
          '数量': {
              fontSize: 12,
              id: "数量",
              text: "数量",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 375,
              y: 120,
          },
          '日期': {
              fontSize: 12,
              id: "日期",
              text: "日期",
              type: "Text",
              width: 100,
              height: 32,
              align: "center",
              x: 400,
              y: 80,
          },
      },
     data:{
          '店名': '武进万达',
          '品名': '麻辣烫',
          productdetail:[
              {
                  '原价': 20,
                  '会员价': 18,
                  '折扣价': 15,
                  '数量': 2,
              },
              {
                  '原价': 30,
                  '会员价': 28,
                  '折扣价': 25,
                  '数量': 1,
              },
          ],
          '二维码': '二维码',
          }


    },

};

const posprinter = createReducer({
    [posprinter_savetemplate]: (state, payload) => {
        const {groupnodes} = payload;
        return { ...state, groupnodes:{...groupnodes}};
    },
}, initial.posprinter);

export default posprinter;
