const FootballPlayer = artifacts.require("./FootballPlayer.sol");
const BasketballPlayer = artifacts.require("./BasketballPlayer.sol");

module.exports = (deployer) => deployer
  .then(() => deployFootballPlayer(deployer))
  .then(() => deployBasketballPlayer(deployer));

  function deployFootballPlayer(deployer){
      return deployer.deploy(FootballPlayer);
  }

  function deployBasketballPlayer(deployer){
    return deployer.deploy(BasketballPlayer);
}
 


