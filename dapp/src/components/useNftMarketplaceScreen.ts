import { useEffect, useState } from 'react';
import { INftAsset, ISmartContractDto, SmartContractTypeDto } from '../dtos';
import axios from 'axios'
import Web3 from 'web3';
import footballPlayerAbi from '../abis/footballPlayerAbi';
import basketballPlayerAbi from '../abis/basketballPlayerAbi';
import { basketballPlayersContractAddress, footballPlayersContractAddress, marketplaceFootballAddress, marketplaceBasketballAddress, openSeaUrl } from '../constants/constants';
import marketplaceAbi from '../abis/marketplaceAbi';

export default function useNftMarketplaceScreen() {

    const [isError, setIsError] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [account,setAccount] = useState<any>();
    const [nftAssets, setNftAssets] = useState<INftAsset[]>([]);
    const [transLink, setTransLink] = useState<string>("");
    const [transHash, setTransHash] = useState<string>("")
    const [chainUrl,setChainUrl] = useState<string>("rinkeby");

    const contracts : ISmartContractDto[] = [];
    contracts.push({ contractAddress: footballPlayersContractAddress,  marketplaceAddress: marketplaceFootballAddress, abi: footballPlayerAbi, marketplaceAbi: marketplaceAbi, type: "ftb" });
    contracts.push({ contractAddress: basketballPlayersContractAddress,  marketplaceAddress: marketplaceBasketballAddress, abi:  basketballPlayerAbi, marketplaceAbi: marketplaceAbi, type: "bsk" } );

    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            web3.eth.net.getNetworkType((error : Error,returnValue : string) => {
                setChainUrl(`https://${returnValue}.etherscan.io/tx/`);
            })
            try { 
            window.ethereum.enable().then(async function(accounts : any) {
                setIsFetching(true);
                setAccount(accounts[0])

                await loadAssets(accounts[0]);
            });
            } catch(e) {
            // User has denied account access to DApp...
            setIsError(true)
            }finally {
                setIsFetching(false);
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            try { 
                window.web3.currentProvider.ethereum.enable().then( async function(accounts : any) {
                    setIsFetching(true);
                    // User has allowed account access to DApp...
                    setAccount(accounts[0])
                    await loadAssets(accounts[0]);
                });
                } catch(e) {
                // User has denied account access to DApp...
                setIsError(true)
                }finally {
                    setIsFetching(false);
                }
        }
        // Non-DApp Browsers
        else {
            alert('You have to install MetaMask !');
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        async function listenMMAccount() {
          window.ethereum.on("accountsChanged", async function() {
            const web3 = new Web3(window.ethereum);
            let accounts = await web3.eth.getAccounts();
            setAccount(accounts[0])
            loadAssets(accounts[0]);
          });
        }
        listenMMAccount();
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAssets = async (accountAddr: any) => {
        setIsFetching(true);

        try {
            let nfts : INftAsset[] =  [];

            for(var i=0;i<contracts.length;i++)
            {
                let contractObj = contracts[i];
            
                    if (window.ethereum) {
                    
                        let quantity : number = 0;
                        let ownershipQuantity : number = 0;
        
                        const web3 = new Web3(window.ethereum);
                        const contract = new web3.eth.Contract(contractObj.abi,contractObj.contractAddress,{from: contractObj.contractAddress});
                        const uri = await contract.methods.uri(1).call();
                    
                        const req = await axios.get(uri.replace('/{id}.json','') + 's')
                        const assets = req.data.assets;
                    
                            for (let i = 0; i < assets.length;i++) {
                                const asset = assets[i];
        
                                const res = await contract.methods.balanceOfBatch([contractObj.marketplaceAddress,accountAddr],[asset.id,asset.id]).call();
 
                                quantity = parseInt(res[0]);
                                ownershipQuantity = parseInt(res[1])
                                const nft =  {
                                    name: asset.name,
                                    description: asset.description,
                                    externalLink: openSeaUrl + contractObj.contractAddress + '/' + asset.id,
                                    tokenId: asset.id,
                                    imageOriginalUrl: asset.image,
                                    imageThumbUrl: asset.image,
                                    imagePreviewUrl: asset.image,
                                    quantity: quantity,
                                    ownershipQuantity : ownershipQuantity,
                                    type: contractObj.type
                                }
        
                                nfts.push(nft)
                            }
                    }
            }

            setNftAssets(nfts);
        }
        catch(e)
        {
            setIsError(true)
            console.log(e)
        }finally
        {
            setIsFetching(false);
        }
    }

    const buyToken = async (tokenId : number, quantity: number, type: SmartContractTypeDto) => {
        if (window.ethereum && contracts.length > 0 && quantity > 0){
            let smartContract = contracts.find(x => x.type === type);
            if(smartContract)
            {
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(smartContract.marketplaceAbi,smartContract.marketplaceAddress,{from: smartContract.marketplaceAddress });
                await contract.methods.buyToken(tokenId,quantity).send({from: account, gas: 3000000, value: quantity * 9000000000000000 })
                .on("transactionHash", function(hash : any){
                    setTransHash(hash)
                    setInProgress(true)
                    setTransLink(chainUrl + hash)
                })
                .on("receipt", function(receipt : any){
                    console.log(receipt)
                    setInProgress(false)
                    loadAssets(account);
                })
                .on("error", function(error : any){
                    console.log(error)
                    setIsError(true)
                    setInProgress(false)
                });
            }
        }
    }


    return {
        isError,  
        isFetching, 
        inProgress,
        account,
        nftAssets,
        transLink,
        transHash,
        buyToken
    }
}