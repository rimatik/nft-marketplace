import React from 'react'
import Grid from '@material-ui/core/Grid/Grid';
import { INftAsset, SmartContractTypeDto } from '../dtos';
import NftCard from './NftCard';
import { CircularProgress, createStyles, Link, makeStyles, Theme, Typography } from '@material-ui/core';
import useNftShowcaseScreen from './useNftMarketplaceScreen';

const useStyles = makeStyles(({ spacing } : Theme) => 
  createStyles({
    root: {
      maxWidth: 270,
    },
    media: {
      maxHeight: 300,
    },
    nftItem: {
      display: 'flex',
      justifyContent: 'center',
      padding: `${spacing(6)}px ${spacing(2)}px`
    },
    transaction: 
    {
      textAlign: 'center'
    }
  })
);

const NftMarketplaceScreen = () => {
const classes = useStyles();
const { nftAssets,isFetching,  transLink, transHash, inProgress, buyToken } = useNftShowcaseScreen();

const handleBuy = (id: number, quantity : number, type: SmartContractTypeDto) => {
  buyToken(id,quantity,type);
}

const handleOnClick = (e : any) => {
  e.preventDefault()
  const newWindow = window.open(transLink, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

if(inProgress){
  return  <Grid container direction="row" justify="center" alignContent="center">
             <Grid item xs={12} className={classes.transaction}> 
                <CircularProgress /> 
              </Grid>
              <Grid item xs={12} className={classes.transaction}>
                <Typography>Transaction : </Typography>
                <Link href={transLink} onClick={handleOnClick}>
                  {transHash}
                </Link>  
            </Grid>
        </Grid>
}

 return (
    <Grid container direction="row" justify="center" alignContent="center">
        {isFetching ? 
            <Grid item> 
              <CircularProgress /> 
           </Grid> :
        nftAssets.map((asset : INftAsset, index : number) => 
            <Grid item  key={index}   className={classes.nftItem}> 
              <NftCard nftAsset={asset} onBuyNft={handleBuy} />   
            </Grid>         
        )} 
    </Grid>
 )
}
export default NftMarketplaceScreen;

