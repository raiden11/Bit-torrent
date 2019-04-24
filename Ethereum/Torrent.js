import web3 from './web3';
import BTorrent from './build/BTorrent.json';

const instance = new web3.eth.Contract(
    JSON.parse(BTorrent.interface),
    '0x9Fc1E03C5012F4b6203C52f0750B0efC8A3cBF75'
);

export default instance;