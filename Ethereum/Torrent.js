import web3 from './web3';
import BTorrent from './build/BTorrent.json';

const instance = new web3.eth.Contract(
    JSON.parse(BTorrent.interface),
    '0xA5F2b8dcBfBA8Bf8bb4C3977F175f6A9F8083C78'
);

export default instance;