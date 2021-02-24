import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { INftAsset, SmartContractTypeDto } from '../dtos';
import { Badge, Button, CardActions, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
      width: 300
    },
    media: {
      height: 300,
    },
    cardContent: {
      height: 100
    },
    buyBtn: {
      width : "100%" , 
      fontWeight: "bold" 
    }
});

  interface INftCard {
      nftAsset : INftAsset;
      onBuyNft: (id: number, quantity: number, type: SmartContractTypeDto) => void;
  }

 const NftCard = (  { nftAsset,onBuyNft }: INftCard ) =>  {
  const classes = useStyles();
  const [quantity,setQuantity] = useState<number>(1);

  const handleOnClick = () => {
    const newWindow = window.open(nftAsset.externalLink, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const handleBuyNft = () => {
    if(nftAsset.quantity > 0)
    {
      onBuyNft(parseInt(nftAsset.tokenId),quantity,nftAsset.type);
    }
  }

  const handleOnChange = (e : any) =>{
    const { value } = e.target;
    setQuantity(value);
  }

  return (
    <Badge badgeContent={nftAsset.ownershipQuantity} color="secondary">
      <Card className={classes.root}>
      <CardActionArea onClick={handleOnClick}>
        <CardMedia
          className={classes.media}
          image={nftAsset.imagePreviewUrl}
          title={nftAsset.name}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {nftAsset.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {nftAsset.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12}>
              <TextField
                disabled={nftAsset.quantity <= 0}
                fullWidth
                label="Quantity"
                type="number"
                defaultValue={nftAsset.quantity > 0 ? 1 : 0}
                InputProps={{ inputProps: { min: nftAsset.quantity > 0 ? 1 : 0, max: nftAsset.quantity } }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleOnChange}
                variant="standard"
              />
          </Grid>
          <Grid item xs={12}>  
            <Button 
              disabled={nftAsset.quantity <= 0}
              className={classes.buyBtn} 
              size="large" 
              color="primary" 
              variant="outlined"
              onClick={handleBuyNft}
            >
              Buy
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
    </Badge>

    
  );
}

export default NftCard;
