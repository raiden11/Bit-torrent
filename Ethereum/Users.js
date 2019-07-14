import web3 from './web3';
import UserBase from './build/UserBase.json';

const instance =new web3.eth.Contract(
    JSON.parse(UserBase.interface),
    '0x5E74838F9703F5dC521678Bf5b06c9E445a53a99'
);

export default instance;
