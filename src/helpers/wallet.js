import {initSdk} from 'tenzorum';
import {saveLocal} from './localstorage'
const Web3 = require('web3');
const Wallet = require('ethereumjs-wallet');
const ethutil = require('ethereumjs-util');
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

export const signMsg = async (msg, cb) => {
  msg = ethutil.sha256(msg.params[0]);
  let result = {};
  try {
    const sig = ethutil.ecsign(msg, new Buffer(JSON.parse(localStorage.account).privateKey, 'hex'));
    result.result = sig.s;
  } catch(e) {
    result.error = e;
  }
    return cb(result.error, result);
};