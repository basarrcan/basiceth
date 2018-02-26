const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const web3 = new Web3('http://localhost:8545');

const EthereumTx = require('ethereumjs-tx')


router.get('/send', function(req, res){
  res.render('send');
});


router.post('/send', function(req,res){
  let txParams = {
    nonce: '0x00',
    gasPrice: '0x09184e72a000',
    gasLimit: web3.utils.numberToHex('100000'),
    to: req.body.address,
    value: web3.utils.toHex(web3.utils.toWei(req.body.amount, 'ether')),
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 15
  }
  let tx = new EthereumTx(txParams);
  let privatekey = new Buffer(req.body.privkey, 'hex');
  tx.sign(privatekey);
  let serializedTx = tx.serialize();

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
});




module.exports = router;
