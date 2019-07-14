import web3 from './web3';
import BTorrent from './build/BTorrent.json';

const instance = new web3.eth.Contract(
    JSON.parse(BTorrent.interface),
    '0x800D901b35d7e15a8b4c6371d1AC6B9BA35c541e'
);

export default instance;