import web3 from './web3';
import BTorrent from './build/BTorrent.json';

const instance = new web3.eth.Contract(
    JSON.parse(BTorrent.interface),
    '0x12e0C135a97fE4222Bc5305eD6f742C18dD528c7'
);

export default instance;