import web3 from './web3';
import UserBase from './build/UserBase.json';

const instance =new web3.eth.Contract(
    JSON.parse(UserBase.interface),
    '0x6716130a5E74fb673c7753cE4D0Fd048A87E88f4'
);

export default instance;
