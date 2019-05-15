import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined'  && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
}
else {

    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/d8e81dfdfe3f4ba2a2e7f417e0295938'
    );
    web3 = new Web3(provider);
}

export default web3; 