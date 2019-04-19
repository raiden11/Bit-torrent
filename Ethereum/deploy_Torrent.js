const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledBtorrent = require('./build/BTorrent.json');


const provider = new HDWalletProvider(
    'fetch universe crack timber dad push hour witness gym early excuse wood',
    'https://rinkeby.infura.io/v3/d8e81dfdfe3f4ba2a2e7f417e0295938'
);

const web3 = new Web3(provider);


let deploy = async () => {

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const result = await new web3.eth.Contract(JSON.parse(compiledBtorrent.interface))
    .deploy({ data: compiledBtorrent.bytecode})
    .send({ from: accounts[0], gas: '3000000' });
    console.log(result.options.address);
}

deploy();

    


    



    