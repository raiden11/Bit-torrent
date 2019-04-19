import Web3 from 'web3';

//const ganache = require('ganache-cli');
let web3;

if (typeof window !== 'undefined'  && typeof window.web3 !== 'undefined') {
    // inside browser and meta mask running
    console.log("metamask");
    web3 = new Web3(window.web3.currentProvider);
}
else {
    // on the server or no metamask present
    /*const provider = new Web3.providers.HttpProvider(
        'http://127.0.0.1:8545'
    );*/
    
    console.log("server");
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/d8e81dfdfe3f4ba2a2e7f417e0295938'
    );
    web3 = new Web3(provider);
}

export default web3; 