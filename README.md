This is a personal version of a tutorial on youtube thanks to daap university
Just saving it on github for to play around with later

youtube video:
https://www.youtube.com/watch?v=XLahq4qyors&list=WL&index=22&t=8533s

their link:
https://www.dappuniversity.com/bootcamp

actual tutorial code from the source:
https://github.com/dappuniversity/defi_tutorial

personal notes:

(truffle console commands)
\$ truffle console
truffle(development)> mDai = await DaiToken.deployed()
truffle(development)> accounts = await web3.eth.getAccounts()
truffle(development)> bal = await mDai.balanceOf(accounts[1])
truffle(development)> web3.utils.fromWei(bal)
truffle(development)>.exit

other coomand(with gnache running on default port):
truffle test
truffle compile
truffle migrate
