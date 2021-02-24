import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import NftMarketplaceScreen from './components/NftMarketplaceScreen';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import Wallet from './components/Wallet';

function App() {

  function getLibrary(provider: any): Web3Provider {
    const lib = new Web3Provider(provider)
    lib.pollingInterval = 12000
    return lib
  }

  const [activate, setActivate] = useState<boolean>(false);
  const handleActivate = (activate : boolean) => {
    setActivate(activate)
  }
  return (
    <div className="App">
      <Grid container>
        <Grid item xs={12} container style={{ maxHeight: '50px' }}>
        <Web3ReactProvider getLibrary={getLibrary}>
            <Wallet onConnect={handleActivate} />
        </Web3ReactProvider>
        </Grid>
        {activate && <NftMarketplaceScreen />}  
      </Grid>
              
   
    </div>
  );
}

export default App;
