import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PAGE_EVENT } from 'src/app/core/constants/common.constant';
import { ContractRegisterType } from 'src/app/core/constants/contract.enum';
import { TokenService } from 'src/app/core/services/token.service';
import { TableTemplate } from '../../../../../../core/models/common.model';
import { Globals } from '../../../../../../global/global';

@Component({
  selector: 'app-token-holders-tab',
  templateUrl: './token-holders-tab.component.html',
  styleUrls: ['./token-holders-tab.component.scss'],
})
export class TokenHoldersTabComponent implements OnInit {
  @Input() keyWord = '';
  @Input() contractAddress: string;
  @Input() isNFTContract: boolean;
  loading = true;

  CW20Templates: Array<TableTemplate> = [
    { matColumnDef: 'id', headerCellDef: 'id' },
    { matColumnDef: 'owner', headerCellDef: 'address' },
    { matColumnDef: 'balance', headerCellDef: 'quantity' },
    { matColumnDef: 'percent_hold', headerCellDef: 'percentage' },
  ];

  CW721Templates: Array<TableTemplate> = [
    { matColumnDef: 'id', headerCellDef: 'id' },
    { matColumnDef: 'owner', headerCellDef: 'address' },
    { matColumnDef: 'balance', headerCellDef: 'quantity' },
    { matColumnDef: 'percent_hold', headerCellDef: 'percentage' },
  ];

  template: Array<TableTemplate> = [];

  templates: Array<TableTemplate> = [
    { matColumnDef: 'id', headerCellDef: 'id' },
    { matColumnDef: 'owner', headerCellDef: 'address' },
    { matColumnDef: 'balance', headerCellDef: 'quantity' },
    { matColumnDef: 'percent_hold', headerCellDef: 'percentage' },
  ];
  displayedColumns: string[] = this.templates.map((dta) => dta.matColumnDef);
  pageData: PageEvent = {
    length: PAGE_EVENT.LENGTH,
    pageSize: 20,
    pageIndex: PAGE_EVENT.PAGE_INDEX,
  };
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(public global: Globals, private tokenService: TokenService) {}

  ngOnInit(): void {
    let tokenType = ContractRegisterType.CW20;
    if (this.isNFTContract) {
      tokenType = ContractRegisterType.CW721;
    }
    this.getListTokenHolder(tokenType);
  }

  getListTokenHolder(tokenType: string) {
    this.loading = true;
    this.tokenService
      .getListTokenHolder(
        this.pageData.pageSize,
        this.pageData.pageIndex * this.pageData.pageSize,
        tokenType,
        this.contractAddress,
      )
      .subscribe((res) => {
        if (res && res.data?.resultAsset?.length > 0) {
          this.pageData.length = res.data?.resultCount;
          let sortedData = res.data?.resultAsset.sort((a, b) => {
            return this.compare(a.percent_hold, b.percent_hold, false);
          });
          this.dataSource = new MatTableDataSource<any>(sortedData);
        }
        this.loading = false;
      });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  paginatorEmit(event): void {
    this.dataSource.paginator = event;
  }
}
