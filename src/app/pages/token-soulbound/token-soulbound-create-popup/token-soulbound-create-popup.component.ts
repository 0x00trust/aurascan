import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MESSAGES_CODE } from 'src/app/core/constants/messages.constant';
import { EnvironmentService } from 'src/app/core/data-services/environment.service';
import { NgxToastrService } from 'src/app/core/services/ngx-toastr.service';
import { SoulboundService } from 'src/app/core/services/soulbound.service';
import { WalletService } from 'src/app/core/services/wallet.service';
import { getKeplr } from 'src/app/core/utils/keplr';
import { serializeSignDoc, OfflineAminoSigner } from '@cosmjs/amino';
import { sha256 } from '@cosmjs/crypto';
import { Secp256k1HdWallet, StdSignDoc} from '@cosmjs/amino';
import { CosmosClient, SigningCosmosClient } from '@cosmjs/launchpad';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { th } from 'date-fns/locale';
import { EncodeObject } from '@cosmjs/proto-signing';
import { CosmJSOfflineSigner } from '@coin98-com/connect-sdk/dist/client/cosmos';
const amino = require('@cosmjs/amino');
import {sortedJsonStringify} from '@cosmjs/amino/build/signdoc';

@Component({
  selector: 'app-token-soulbound-create-popup',
  templateUrl: './token-soulbound-create-popup.component.html',
  styleUrls: ['./token-soulbound-create-popup.component.scss'],
})
export class TokenSoulboundCreatePopupComponent implements OnInit {
  createSBTokenForm: FormGroup;
  isSubmit = false;
  network = this.environmentService.configValue.chain_info;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TokenSoulboundCreatePopupComponent>,
    private environmentService: EnvironmentService,
    private walletService: WalletService,
    private soulboundService: SoulboundService,
    private toastr: NgxToastrService,
  ) {}

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.createSBTokenForm = new FormGroup({
      soulboundTokenURI: new FormControl('', Validators.required),
      receiverAddress: new FormControl('', Validators.required),
    });
  }

  closeDialog() {
    this.dialogRef.close('canceled');
  }

  async onSubmit() {
    const minter = this.walletService.wallet?.bech32Address;
    const { soulboundTokenURI, receiverAddress } = this.createSBTokenForm.value;

    const keplr = await getKeplr();
    const agreement = `Agreement(string chain_id,address active,address passive,string tokenURI)`;
    const data = agreement + this.network.chainId + receiverAddress + minter + soulboundTokenURI;
    const keplrAccounts = await keplr.getOfflineSigner(this.network.chainId).getAccounts();

    const keplrSign =  await keplr.signArbitrary(
      this.network.chainId,
      keplrAccounts[0].address,
      data);
    console.log(keplrSign);


    const payload = {
      signature: keplrSign.signature,
      msg: data,
      pubKey: keplrSign.pub_key,
      contract_address: this.data.contractAddress,
      receiver_address: receiverAddress,
      token_uri: soulboundTokenURI,
    };
    console.log(payload);
    // this.dialogRef.close();
    // this.executeCreate(payload);
  }

  createMessageToSign(chainID, active, passive, uri) {
    const AGREEMENT = 'Agreement(address active,address passive,string tokenURI)';

    // create message to sign based on concating AGREEMENT, signer, receiver, and uri
    const message = AGREEMENT + active + passive + uri;

    const msgTest: any = {
      chain_id: chainID,
      account_number: '0',
      sequence: '0',
      fee: { gas: '0', amount: [] },
      msgs: {
        type: 'sign/MsgSignData',
        value: {
          signer: passive,
          data: message
        }
      },
      memo: ''
    };
    return msgTest;
  }

  

  checkFormValid(): boolean {
    return true;
  }

  executeCreate(payload) {
    this.soulboundService.createSBToken(payload).subscribe(
      (res) => {
        if (res?.code) {
          let msgError = res?.message.toString() || 'Error';
          this.toastr.error(msgError);
        } else {
          this.toastr.success(MESSAGES_CODE.SUCCESSFUL.Message);
        }
      },
      (error) => {
        this.toastr.error(error);
      },
    );
  }
}
