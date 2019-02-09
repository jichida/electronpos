const islocalhost = false;
const serverurl = islocalhost?'http://localhost:4109':'http://pos.i2u.top:4109';
const serverurlrestful = islocalhost?`${serverurl}/api`:`${serverurl}/api`;
const wspath = islocalhost?'/socket.io':'/socket.io';

let config = {
    ispopalarm:false,
    serverurlrestful,
    serverurl:`${serverurl}`,
    wspath:`${wspath}`,
    requesttimeout:5000,
    appversion:'1.0.0(build0209)',
    sendlocationinterval:20000,
    softmode:'app'
};


export default config;
