import web3 from './web3';
import BTorrent from './build/BTorrent.json';

const instance = new web3.eth.Contract(
    JSON.parse(BTorrent.interface),
    '0xBeAc957af38Bb778B39C9b132166A84E9cc7C1a9'
);

export default instance;