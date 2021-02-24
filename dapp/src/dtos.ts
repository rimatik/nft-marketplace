export interface INftAsset
{
   name: string
   description: string
   externalLink: string;
   tokenId: string
   imagePreviewUrl: string
   imageThumbUrl: string
   imageOriginalUrl: string
   quantity: number;
   ownershipQuantity: number;
   type: SmartContractTypeDto;
}

export interface ISmartContractDto
{
   contractAddress: string
   marketplaceAddress: string
   abi: any
   marketplaceAbi: any
   type: SmartContractTypeDto
}


export type SmartContractTypeDto = "ftb" | "bsk";