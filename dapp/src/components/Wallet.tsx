import {formatEther} from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import React, { useEffect } from 'react';
import { Grid, Typography, Button, makeStyles, createStyles, Container, Box } from '@material-ui/core';
import { Web3Provider } from '@ethersproject/providers'
import useSWR from 'swr'
import Metamask from '../images/metamask.jpg';

const supportedChainIds = [
  1, // Mainet
  3, // Ropsten
  4, // Rinkeby
  5, // Goerli
  42, // Kovan
];

const chains = [
  {id: 1, name: "Mainet" },
  {id: 3, name: "Ropsten" },
  {id: 4, name: "Rinkeby" },
  {id: 5, name: "Goerli" },
  {id: 42, name: "Kovan" }
]

export const injectedConnector = new InjectedConnector({
    supportedChainIds
})

  
const fetcher = (library : any) => (...args : any) => {
  const [method, ...params] = args
  return library[method](...params)
}

const useStyles = makeStyles(() =>
  createStyles({
    connectWalletBtn:{
      color: "#555b6e", 
      borderRadius: "10px",
      backgroundColor:"#ffd6ba",
      textAlign: "center" 
    },
    metamaskImage:{
      maxWidth: '150px',
      maxHeight: '150px',
      marginBottom: "5px"
    },
    balance : {
      background: "#F9E0D9", 
      borderRadius: "5px",
      padding: "2px 12px" 
    },
    networkName: {
      background: "#F1EBE4", 
      borderRadius: "5px", 
      padding: "2px 12px" 
    },
    contentCenter:{
      textAlign: "center" 
    },
    flipCoinHeader:{
      marginTop: '3px',
      color: "#555b6e" 
    },
    flipCoinBox:{
      borderRadius:"10px",
      backgroundColor:"#faf9f9",
      height: '450px',
      maxHeight: '450px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: "center"
    },
    connectWalletItem:{
      marginTop: '75px',
      textAlign: 'center' 
    }
})
);

interface IWallet {
  onConnect: (activate : boolean) => void;
}

const Wallet = ({ onConnect } : IWallet ) => {
    const { chainId, account, activate, active } = useWeb3React<Web3Provider>()
    const { library } = useWeb3React<Web3Provider>()
    const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'], {
      fetcher: fetcher(library),
    })
 
    useEffect(() => {
      // listen for changes on an Ethereum address
      library?.on('block', () => {
        mutate(undefined, true)
      })
      // remove listener when the component is unmounted
      return () => {
        library?.removeAllListeners('block')
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      async function listenAccounts() 
      {
        if(library?.provider === undefined || (await library?.listAccounts()).length === 0){
          onConnect(false)
        }
      }
      listenAccounts();
    }, [library]) // eslint-disable-line react-hooks/exhaustive-deps

    const classes = useStyles();

    const  handleConnectWalletClick = async () => {
      await activate(injectedConnector)
      onConnect(true)
    }

    const capitalizeFirst = (str : string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if(!active){
    return (
      <Grid item xs={12} container> 
          <Grid item xs={6} container justify="flex-start">
              <Typography variant="h4">Nft marketplace</Typography>
          </Grid>
          <Grid item xs={12} className={classes.connectWalletItem}>
            <Container maxWidth="sm">
              <Box display="flex" className={classes.flipCoinBox} justifyContent="center">
                <Grid container>
                  <Grid item className={classes.contentCenter} xs={12}>
                    <img src={Metamask} className={classes.metamaskImage} alt="metamask"/>
                  </Grid>
                  <Grid className={classes.contentCenter} xs={12}>
                    <Button variant="contained" size="large" type="submit" className={classes.connectWalletBtn} onClick={handleConnectWalletClick}>Connect wallet</Button> 
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Grid>
    </Grid> 
    )
  }
    
    return (
      <Grid item xs={12} container>       
        <Grid item xs={6} container justify="flex-start">
            <Typography variant="h4">Nft marketplace</Typography>
        </Grid>    
        <Grid item container justify="flex-end" xs={6}>
            <Grid item>
                <Typography className={classes.networkName}>{capitalizeFirst(chains.find(x => x.id === chainId)!.name)}</Typography>
            </Grid>&nbsp;&nbsp;
            <Grid item>
                <Typography className={classes.balance}>{balance && parseFloat(formatEther(balance)).toPrecision(4)} ETH</Typography>
            </Grid>
            <Grid item>
                <Typography className={classes.networkName}>{account?.substr(0,6)}...{account?.substr(36,4)}</Typography>  
            </Grid>
        </Grid>
          
      </Grid>
    )
}

export default Wallet;