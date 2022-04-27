const Token = artifacts.require("MyToken");
require('dotenv').config({path:'../.env'});

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async accounts=>{
    const [initialHolder, recipient, anotherAccount] = accounts;

    beforeEach(async() =>{
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    });
    it("All tokens should be in my account", async() =>{
        let instance = this.myToken;

        let totalSupply = await instance.totalSupply();

        return await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("Success case of sending token from Account 1 to Account 2", async()=>{
        const tokenAmount = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, tokenAmount)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber
                                        .equal(totalSupply.sub(new BN(tokenAmount)));
       return await expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(tokenAmount));


    });

    it("Failure case of sending token, when account doesn't have enough token", async()=>{
        let instance = this.myToken;
        let accountBalance = await instance.balanceOf(initialHolder);

        await expect(instance.transfer(recipient, accountBalance+1)).to.eventually.be.rejected;

        return await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(accountBalance);

    });
});