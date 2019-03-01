import { createReducer } from 'redux-act';
import {
    posprinter_savetemplate,
} from '../actions/index.js';
// import moment from 'moment';

const initial = {
    posprinter: {
        billnodes:{
          '二维码': { 
              id: "二维码", 
              data: "M1 1h7v7h-7zM9 1h2v2h-1v-1h-1zM13 1h1v3h-1zM15 1h7v7h-7zM2 2v5h5v-5zM16 2v5h5v-5zM3 3h3v3h-3zM9 3h1v2h2v1h-3zM11 3h1v1h-1zM17 3h3v3h-3zM12 4h1v1h-1zM9 7h1v1h-1zM11 7h1v3h-1v-1h-1v-1h1zM13 7h1v1h-1zM1 9h4v1h2v1h1v1h-1v1h1v1h-2v-1h-1v1h-2v-3h1v1h2v-1h-2v-1h-1v1h-2zM7 9h1v1h-1zM9 9h1v3h-1zM14 9h1v1h-1zM17 9h3v2h-2v1h-1v-1h-1v4h-1v-2h-2v-3h1v2h1v-2h2zM21 9h1v2h-1zM11 11h1v1h-1zM10 12h1v1h-1zM19 12h1v1h-1zM21 12h1v1h-1zM11 13h2v2h-1v-1h-1zM20 13h1v1h-1zM9 14h2v3h-1v-2h-1zM17 14h3v1h-3zM1 15h7v7h-7zM16 15h1v1h2v1h2v2h-1v-1h-1v1h-1v-1h-2v-1h-2v-1h2zM21 15h1v1h-1zM2 16v5h5v-5zM12 16h1v1h-1zM3 17h3v3h-3zM11 17h1v1h1v-1h1v2h-3zM9 18h1v4h-1zM15 19h3v1h-1v2h-1v-2h-1zM18 20h2v1h-2zM21 20h1v1h-1zM11 21h3v1h-3z",
              type: "Path", 
              fill: "black",
              rotation: 0,
              x: 200, 
              y: 140,
              scale: {x: 4, y: 4} 
        },
          '会员价': {
              fontSize: 12,
              id: "会员价",
              text: "会员价",
              type: "Text",
              rotation: 0,
              x: 125,
              y: 120
          },
          '单位': {
              fontSize: 12,
              id: "单位",
              text: "单位",
              type: "Text",
              rotation: 0,
              x: 180,
              y: 20,
          },
          '原价': {
              fontSize: 12,
              id: "原价",
              text: "原价",
              type: "Text",
              rotation: 0,
              x: 0,
              y: 120,
          },
          '品名': {
              fontSize: 12,
              id: "品名",
              text: "品名",
              type: "Text",
              rotation: 0,
              x: 0,
              y: 80,
          },
          '折扣价': {
              fontSize: 12,
              id: "折扣价",
              text: "折扣价",
              type: "Text",
              rotation: 0,
              x: 250,
              y: 120,
          },
          '数量': {
              fontSize: 12,
              id: "数量",
              text: "数量",
              type: "Text",
              rotation: 0,
              x: 375,
              y: 120,
          },
          '日期': {
              fontSize: 12,
              id: "日期",
              text: "日期",
              type: "Text",
              rotation: 0,
              x: 400,
              y: 80,
          },
        },
        billdata:{
          '单位': '武进万达',
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
        },
        tagnodes: {
            二维码:{
                data: "M1 1h7v7h-7zM9 1h2v2h-1v-1h-1zM13 1h1v3h-1zM15 1h7v7h-7zM2 2v5h5v-5zM16 2v5h5v-5zM3 3h3v3h-3zM9 3h1v2h2v1h-3zM11 3h1v1h-1zM17 3h3v3h-3zM12 4h1v1h-1zM9 7h1v1h-1zM11 7h1v3h-1v-1h-1v-1h1zM13 7h1v1h-1zM1 9h4v1h2v1h1v1h-1v1h1v1h-2v-1h-1v1h-2v-3h1v1h2v-1h-2v-1h-1v1h-2zM7 9h1v1h-1zM9 9h1v3h-1zM14 9h1v1h-1zM17 9h3v2h-2v1h-1v-1h-1v4h-1v-2h-2v-3h1v2h1v-2h2zM21 9h1v2h-1zM11 11h1v1h-1zM10 12h1v1h-1zM19 12h1v1h-1zM21 12h1v1h-1zM11 13h2v2h-1v-1h-1zM20 13h1v1h-1zM9 14h2v3h-1v-2h-1zM17 14h3v1h-3zM1 15h7v7h-7zM16 15h1v1h2v1h2v2h-1v-1h-1v1h-1v-1h-2v-1h-2v-1h2zM21 15h1v1h-1zM2 16v5h5v-5zM12 16h1v1h-1zM3 17h3v3h-3zM11 17h1v1h1v-1h1v2h-3zM9 18h1v4h-1zM15 19h3v1h-1v2h-1v-2h-1zM18 20h2v1h-2zM21 20h1v1h-1zM11 21h3v1h-3z",
                fill: "black",
                id: "二维码",
                type: "Path",
                rotation: 0,
                scale: {x: 4, y: 4},
                x: 160,
                y: 60,
            },
            原价:{
                fontSize: 18,
                id: "原价",
                type: "Text",
                rotation: 0,
                text: "价格",
                x: 190,
                y: 160,
            },
            品名:{
                fontSize: 22,
                id: "品名",
                type: "Text",
                rotation: 0,
                text: "品名",
                x: 190,
                y: 40,
            }
        },
        tagdata: {
            '店名': '武进万达',
            '品名': '麻辣烫',
            '原价': 20,
            '会员价': 18,
            '折扣价': 15,
            '数量': 2,
            '二维码': '二维码',
          },
    },

};

const posprinter = createReducer({
    [posprinter_savetemplate]: (state, payload) => {
        const {groupnodes} = payload;
        return { ...state, groupnodes:{...groupnodes}};
    },
}, initial.posprinter);

export default posprinter;
