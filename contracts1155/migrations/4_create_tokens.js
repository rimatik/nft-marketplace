const FootballPlayer = artifacts.require("./FootballPlayer.sol");
const BasketballPlayer = artifacts.require("./BasketballPlayer.sol");
const MarketplaceFootball = artifacts.require("./MarketplaceFootball.sol");
const MarketplaceBasketball = artifacts.require("./MarketplaceBasketball.sol");

module.exports = (deployer) => deployer
  .then(() => createFootballPlayers())
  .then(() => createBasketballPlayers());

  async function createFootballPlayers(){
      (await FootballPlayer.deployed()).mintPlayer(MarketplaceFootball.address,1,30);
      (await FootballPlayer.deployed()).mintPlayer(MarketplaceFootball.address,2,20);
      (await FootballPlayer.deployed()).mintPlayer(MarketplaceFootball.address,3,10);    
  }

  async function createBasketballPlayers(){
    (await BasketballPlayer.deployed()).mintPlayer(MarketplaceBasketball.address,1,30);
    (await BasketballPlayer.deployed()).mintPlayer(MarketplaceBasketball.address,2,20);
    (await BasketballPlayer.deployed()).mintPlayer(MarketplaceBasketball.address,3,10);    
}
