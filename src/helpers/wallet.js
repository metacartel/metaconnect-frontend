import {saveLocal} from './localstorage'
import {web3RopstenInstance} from "./web3";
const Wallet = require('ethereumjs-wallet');

/**
 * @desc create ethereum wallet and save to local storage
 */
export const createWallet = async () => {
  const newWallet = Wallet.generate();
  const { address } = web3RopstenInstance.eth.accounts.privateKeyToAccount(newWallet.getPrivateKeyString().substring(2));
  await saveLocal("account", { privateKey: newWallet.getPrivateKeyString().substring(2), publicAddress: address });
};