import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { TranslateService } from '@ngx-translate/core';
import { MESSAGES_CODE, MESSAGES_CODE_CONTRACT } from 'src/app/core/constants/messages.constant';
import { ESigningType } from 'src/app/core/constants/wallet.constant';
import { EnvironmentService } from 'src/app/core/data-services/environment.service';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxToastrService } from 'src/app/core/services/ngx-toastr.service';
import { SoulboundService } from 'src/app/core/services/soulbound.service';
import { WalletService } from 'src/app/core/services/wallet.service';
import { getKeplr } from 'src/app/core/utils/keplr';
import { getSigner } from 'src/app/core/utils/signing/signer';
const amino = require('@cosmjs/amino');
import {AccountData, DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { Keplr } from '@keplr-wallet/types';
import {makeSignDoc, StdSignDoc, StdSignature} from '@cosmjs/amino';
import { serializeSignDoc } from '@cosmjs/amino';
import { sha256 } from '@cosmjs/crypto';
import { SigningCosmosClient, Secp256k1HdWallet } from '@cosmjs/launchpad';

@Component({
  selector: 'app-token-soulbound-detail-popup',
  templateUrl: './token-soulbound-detail-popup.component.html',
  styleUrls: ['./token-soulbound-detail-popup.component.scss'],
})
export class TokenSoulboundDetailPopupComponent implements OnInit {
  isError = false;
  image_s3 = this.environmentService.configValue.image_s3;
  defaultImgToken = this.image_s3 + 'images/aura__ntf-default-img.png';
  network = this.environmentService.configValue.chain_info;
  currentAddress = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public soulboundDetail: any,
    public dialogRef: MatDialogRef<TokenSoulboundDetailPopupComponent>,
    private environmentService: EnvironmentService,
    public commonService: CommonService,
    private walletService: WalletService,
    private toastr: NgxToastrService,
    public translate: TranslateService,
  ) {
  }

  ngOnInit(): void {}

  error(): void {
    this.isError = true;
  }

  closeDialog() {
    this.dialogRef.close('canceled');
  }

  async getKeplr(): Promise<Keplr | undefined> {
    if (window.keplr) {
        return window.keplr;
    }
    
    if (document.readyState === "complete") {
        return window.keplr;
    }
    
    return new Promise((resolve) => {
        const documentStateChange = (event: Event) => {
            if (
                event.target &&
                (event.target as Document).readyState === "complete"
            ) {
                resolve(window.keplr);
                document.removeEventListener("readystatechange", documentStateChange);
            }
        };
        
        document.addEventListener("readystatechange", documentStateChange);
    });
  }

  async equipSB() {
    this.currentAddress = this.walletService.wallet?.bech32Address;
    const keplr = await getKeplr();
    // let dataKeplr = await keplr.signArbitrary(this.network.chainId, this.currentAddress, this.soulboundDetail.token_id);

    // let messageToSign = this.createMessageToSign(
    //   this.network.chainId,
    //   'aura1uh24g2lc8hvvkaaf7awz25lrh5fptthu2dhq0n',
    //   this.currentAddress,
    //   this.soulboundDetail.token_uri,
    // );
    // console.log(messageToSign);

    // const signedDoc = await keplr.signAmino(this.network.chainId, this.currentAddress, messageToSign);

    // console.log(signedDoc);

    // const messageToSign = this.createMessageToSign(chainID, active, passive, uri);

    if (this.currentAddress) {
      const msgExecute = {
        take: {
          from: this.soulboundDetail.minter_address,
          uri: this.soulboundDetail.token_uri,
          signature: {
            hrp: 'utaura',
            pub_key: this.soulboundDetail.pub_key,
            signature: this.soulboundDetail.signature,
          },
        },
      };

      // console.log(msgExecute);
      // this.walletService.walletExecute(
      //   this.walletService.wallet.bech32Address,
      //   this.soulboundDetail.contract_address,
      //   msgExecute,
      // );

      // Contract to test [aura1zp24522ecc3dhux08m8r3p7629c5madew5chmvj6vecxfgv89flse6a2he]
      await this.take('aura1zp24522ecc3dhux08m8r3p7629c5madew5chmvj6vecxfgv89flse6a2he', 
      'aura1uh24g2lc8hvvkaaf7awz25lrh5fptthu2dhq0n',
      'https://ipfs.io/ipfs/QmYGgEFqTRkWvNZ6u7gfk9HDdh55bQAbYVyc16TF1zX658/691');

      // const signer = getSigner(ESigningType.Keplr, this.walletService.chainInfo.chainId)
      //   .then((signer) => {
      //     return SigningCosmWasmClient.connectWithSigner(this.walletService.chainInfo.rpc, signer);
      //   })
      //   .then((client) => {
      //     return client.execute(
      //       this.walletService.wallet.bech32Address,
      //       this.soulboundDetail.contract_address,
      //       msgExecute,
      //       {
      //         amount: [
      //           {
      //             amount: '0.0025',
      //             denom: 'utaura',
      //           },
      //         ],
      //         gas: '500000',
      //       },
      //     );
      //   })
      //   .then((e) => {
      //     console.log('eee', e);
      //   })
      //   .catch((err) => {
      //     console.log('rrr', err);
      //   });

      // this.execute(msgExecute);
    }

    // const payload = {
    //   signature: dataKeplr.signature,
    //   msg: this.soulboundDetail.token_id,
    //   pubKey: dataKeplr.pub_key.value,
    //   id: this.soulboundDetail.token_id,
    //   status: this.soulboundDetail.status,
    // };

    // this.soulboundService.updatePickSBToken(payload).subscribe((res) => {
    //   if (res?.code) {
    //     let msgError = res?.message.toString() || 'Error';
    //     this.toastr.error(msgError);
    //   } else {
    //     this.toastr.success(MESSAGES_CODE.SUCCESSFUL.Message);
    //     this.dialogRef.close();
    //   }
    //   // this.getListSB();
    // });
  }

  async take(contract, deployAddress: string, uri) {
    
    // gas price
    const gasPrice = GasPrice.fromString(`0.025utaura`);
    const keplr =  await this.getKeplr();;

    const offlineSigner = keplr.getOfflineSignerOnlyAmino(this.network.chainId);

    // connect tester wallet to chain
    const testerClient = await SigningCosmWasmClient.connectWithSigner(this.network.rpc, offlineSigner, { gasPrice });

    // sign message
    const receiverAddress = (await offlineSigner.getAccounts())[0].address;
    try{
      /**
       * @todo call api to fill pub_key & signature
       */
      const permitSignature=  {
        hrp: 'aura',
        pub_key: 'A9EkWupSnnFmIIEWG7WtMc0Af/9oEuEeSRTKF/bJrCfh',
        signature: 'vUMf6gv7yGDtg91NYhBfAic5I0/uCvKpc6LLJliIlq8MAr6O+0R/bTl2upG8t8uittMBolJdKfX6CMWeUrDrIg=='
      }
      const memo = "";

      
      // define the take message using the address of deployer, uri of the nft and permitSignature
      const ExecuteTakeMsg = {
          take: {
              from: deployAddress,
              uri,
              signature: permitSignature,
          }
      }

      console.log("ExecuteTakeMsg: ", ExecuteTakeMsg);

    // take a NFT
      const takeResponse = await testerClient.execute(receiverAddress, contract, ExecuteTakeMsg, "auto", memo);
      console.log(takeResponse);
    }catch(err){
      console.log(err);
    }
  }

  execute(data) {
    let msgError = MESSAGES_CODE_CONTRACT[5].Message;
    msgError = msgError ? msgError.charAt(0).toUpperCase() + msgError.slice(1) : 'Error';
    try {
      this.walletService
        .execute(this.currentAddress, this.soulboundDetail.contract_address, data)
        .then((e) => {
          // msg.isLoading = false;
          if ((e as any).result?.error) {
            this.toastr.error(msgError);
          } else {
            if ((e as any)?.transactionHash) {
              this.toastr.loading((e as any)?.transactionHash);
              setTimeout(() => {
                this.toastr.success(this.translate.instant('NOTICE.SUCCESS_TRANSACTION'));
              }, 4000);
            }
          }
        })
        .catch((error) => {
          // msg.isLoading = false;
          if (!error.toString().includes('Request rejected')) {
            this.toastr.error(msgError);
          }
        });
    } catch (error) {
      this.toastr.error(`Error: ${msgError}`);
    }
  }
}
