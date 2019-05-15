import web3 from './web3';
import UserBase from './build/UserBase.json';

const instance =new web3.eth.Contract(
    JSON.parse(UserBase.interface),
    '0x26a88D92A968907b339bE4CD972F1b13a1ab5A0B'
);

export default instance;
