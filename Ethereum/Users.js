import web3 from './web3';
import UserBase from './build/UserBase.json';

const instance =new web3.eth.Contract(
    JSON.parse(UserBase.interface),
    '0xBedc889148494AF7513970065C18b2346149e834'
);

export default instance;
