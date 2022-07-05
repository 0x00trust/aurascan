import { Component, OnInit } from '@angular/core';
import { CodeTransaction } from '../../../../app/core/constants/transaction.enum';
import { TYPE_TRANSACTION } from '../../../../app/core/constants/transaction.constant';
import { TokenType } from 'src/app/core/constants/token.enum';

@Component({
  selector: 'app-token-detail',
  templateUrl: './token-detail.component.html',
  styleUrls: ['./token-detail.component.scss'],
})
export class TokenDetailComponent implements OnInit {
  countCurrent: string = '';
  tokenTransferList: any[];
  token: string = '';
  loading = true;
  typeTransaction = TYPE_TRANSACTION;
  textSearch: string = '';
  codeTransaction = CodeTransaction;
  tokenName = 'Aura';
  tokenType: TokenType;

  constructor() {}

  ngOnInit(): void {
    //change type of Token
    this.tokenType = TokenType.NFT;
  }
  
  searchTokenTable(): void {}
}
