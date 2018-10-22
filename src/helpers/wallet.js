import {initSdk} from 'tenzorum';
import {saveLocal} from './localstorage'
const Web3 = require('web3');
const Wallet = require('ethereumjs-wallet');
const web3 = new Web3();
const Tx = require('ethereumjs-tx');

//TODO: switch to mainnet
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/'));
initSdk(JSON.parse(localStorage.account).privateKey, "0xf8894138aa4d7b54b7d49afa9d5600cdb5178721", web3, "ropsten");

/**
 * @desc create ethereum wallet and save to local storage
 */
export const createWallet = async () => {
  const newWallet = Wallet.generate();
  const { address } = web3.eth.accounts.privateKeyToAccount(newWallet.getPrivateKeyString().substring(2));
  await saveLocal("account", { privateKey: newWallet.getPrivateKeyString().substring(2), publicAddress: address });
};

export const _sendETH = async (_addr, _amount, _data) => {
  // const publicAddress = getPubKey();
  // if(addr && amount) {
  //   const nonce = await web3.eth.getTransactionCount(publicAddress);
  //   const data = _data || '';
  //   const chainId = await web3.eth.net.getId();
  //   const rawTx = {
  //     nonce: nonce,
  //     from: publicAddress,
  //     to: _addr,
  //     value: 100000000000000,
  //     gasPrice: 20000000000,
  //     gasLimit: 3000000,
  //     data,
  //     chainId,
  //   };
  //
  //   const tx = new Tx(rawTx);
  //   tx.sign(JSON.parse(localStorage.account).privateKey);
  //
  //   const serializedTx = tx.serialize();
  //
  //   web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  //     .on('transactionHash', (txHash) => {
  //       console.log('TransactionHash:' , txHash);
  //     })
  //     .on('receipt', (rec) => {
  //       console.log('Receipt:' , rec);
  //     })
  // }
};

export const signMsg = async msg => {
  const tx = new Tx(msg);
  console.log(JSON.parse(localStorage.account).privateKey, 'hex');
  tx.sign(new Buffer(JSON.parse(localStorage.account).privateKey, 'hex'));

  const serializedTx = tx.serialize();
  // return serializedTx;
  // return tx;

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('transactionHash', (txHash) => {
      console.log('TransactionHash:' , txHash);
    })
    .on('receipt', (rec) => {
      console.log('Receipt:' , rec);
    })
};