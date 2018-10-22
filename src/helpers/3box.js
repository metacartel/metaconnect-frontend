import {signMsg} from "./wallet";

const ethers = require('ethers')
const Web3 = require('web3');
const ProviderBridge = require('ethers-web3-bridge');
const ThreeBox = require('3box');

let web3 = new Web3();
let currentAccount;
let metamask = false;

let web3Provider;
// web3Provider = "metamask"
// web3Provider = "ethers"
web3Provider = "browser";

if (web3Provider === "browser") {

  Web3.providers.HttpProvider.prototype.sendAsync = signMsg;
  web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/'));
  currentAccount = JSON.parse(localStorage.account).publicAddress;

} else if (web3Provider === "ethers") {

  let provider = ethers.providers.getDefaultProvider();
  let signer = new ethers.Wallet("0x"+JSON.parse(localStorage.account).privateKey);
  web3 = new Web3(new ProviderBridge(provider, signer));
  console.log('ETHERS:', ethers);
  console.log("ETHERS-web3: ", web3);
  console.log("ETHERS-signer: ", signer);

} else if (web3Provider === "metamask") {

  web3 = window.web3;
  metamask = true;
  window.web3.eth.getAccounts(function(err, accounts) {
    if (accounts.length !== 0) {
      currentAccount = accounts[0];
    } else {
      alert("Unlock or setup your metamask")
    }
  });

}


export const createAccount = async address => {
  return await ThreeBox.openBox(currentAccount, web3.currentProvider);
};

export const getAccount =  async address => {
  return await ThreeBox.getProfile(currentAccount);
};
