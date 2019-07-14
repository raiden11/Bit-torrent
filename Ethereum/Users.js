import web3 from './web3';
import UserBase from './build/UserBase.json';

const instance =new web3.eth.Contract(
    JSON.parse(UserBase.interface),
    '0xe7CAaD7ed9D364aB0D0D14E57F8F31c3b01cf888'
);

export default instance;
