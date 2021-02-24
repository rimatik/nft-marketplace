const FootballPlayer = artifacts.require("./FootballPlayer.sol");
const BasketballPlayer = artifacts.require("./BasketballPlayer.sol");
const MarketplaceFootball = artifacts.require("./MarketplaceFootball.sol");
const MarketplaceBasketball = artifacts.require("./MarketplaceBasketball.sol");

module.exports = (deployer) => deployer
  .then(() => deployFootballMarketplace(deployer))
  .then(() => deployBasketballMarketplace(deployer));

  function deployFootballMarketplace(deployer){
      return deployer.deploy(MarketplaceFootball, FootballPlayer.address);
  }

  function deployBasketballMarketplace(deployer){
    return deployer.deploy(MarketplaceBasketball, BasketballPlayer.address);
  }
