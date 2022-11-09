import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LENGTH_CHARACTER, LIST_TYPE_CONTRACT_ADDRESS, PAGE_EVENT } from 'src/app/core/constants/common.constant';
import { ContractVerifyType } from 'src/app/core/constants/contract.enum';
import { TYPE_TRANSACTION } from 'src/app/core/constants/transaction.constant';
import { EnvironmentService } from 'src/app/core/data-services/environment.service';
import { TableTemplate } from 'src/app/core/models/common.model';
import { CommonService } from 'src/app/core/services/common.service';
import { Globals } from 'src/app/global/global';
import { IContractPopoverData } from 'src/app/core/models/contract.model';
import { TokenService } from 'src/app/core/services/token.service';
import { checkTypeFile, parseDataTransaction } from 'src/app/core/utils/common/info-common';
import { ModeExecuteTransaction } from 'src/app/core/constants/transaction.enum';

@Component({
  selector: 'app-nft-detail',
  templateUrl: './nft-detail.component.html',
  styleUrls: ['./nft-detail.component.scss'],
})
export class NFTDetailComponent implements OnInit {
  pageData: PageEvent = {
    length: PAGE_EVENT.LENGTH,
    pageSize: 20,
    pageIndex: PAGE_EVENT.PAGE_INDEX,
  };
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  templates: Array<TableTemplate> = [
    // { matColumnDef: 'popover', headerCellDef: '' },
    { matColumnDef: 'tx_hash', headerCellDef: 'Txn Hash' },
    { matColumnDef: 'type', headerCellDef: 'Method' },
    { matColumnDef: 'status', headerCellDef: 'Result' },
    { matColumnDef: 'timestamp', headerCellDef: 'Time' },
    { matColumnDef: 'from_address', headerCellDef: 'From' },
    { matColumnDef: 'to_address', headerCellDef: 'To' },
    { matColumnDef: 'price', headerCellDef: 'Price' },
  ];

  displayedColumns: string[] = this.templates.map((dta) => dta.matColumnDef);

  loading = false;
  nftId = '';
  contractAddress = '';
  nftDetail: any;
  typeTransaction = TYPE_TRANSACTION;
  contractType = ContractVerifyType.Exact_Match;
  contractVerifyType = ContractVerifyType;
  modeExecuteTransaction = ModeExecuteTransaction;
  nextKey = null;
  currentKey: string;
  nftType: string;
  isError = false;

  image_s3 = this.environmentService.configValue.image_s3;
  defaultImgToken = this.image_s3 + 'images/aura__ntf-default-img.png';
  defaultLogoToken = this.image_s3 + 'images/icons/token-logo.png';
  lengthNormalAddress = LENGTH_CHARACTER.ADDRESS;

  denom = this.environmentService.configValue.chain_info.currencies[0].coinDenom;
  coinMinimalDenom = this.environmentService.configValue.chain_info.currencies[0].coinMinimalDenom;

  constructor(
    public commonService: CommonService,
    public global: Globals,
    public route: Router,
    private environmentService: EnvironmentService,
    private tokenService: TokenService,
    private router: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.contractAddress = this.router.snapshot.paramMap.get('contractAddress');
    this.nftId = this.router.snapshot.paramMap.get('nftId');
    this.getNFTDetail();
    this.getDataTable();
  }

  error(): void {
    this.isError = true;
  }

  getNFTDetail() {
    this.loading = true;
    const encoded = encodeURIComponent(this.nftId);
    this.tokenService.getNFTDetail(this.contractAddress, encoded).subscribe((res) => {
      this.nftDetail = res.data;

      if (this.nftDetail?.asset_info?.data?.info?.extension?.image?.indexOf('twilight') > 1) {
        this.nftDetail['isDisplayName'] = true;
        this.nftDetail['nftName'] = this.nftDetail?.asset_info?.data?.info?.extension?.name || '';
      }

      this.nftType = checkTypeFile(this.nftDetail?.animation?.link_s3);
      if (this.nftType === '') {
        switch (this.nftDetail?.animation?.content_type) {
          case 'video/webm':
          case 'video/mp4':
            this.nftType = 'video';
            break;
          case 'image/png':
          case 'image/jpeg':
          case 'image/gif':
          case 'application/xml':
          case 'image/svg+xml':
            this.nftType = 'img';
            break;
          case 'model/gltf-binary':
          case 'gltf':
            this.nftType = '3d';
            break;
          case 'audio/mpeg':
          case 'audio/vnd.wave':
          case 'audio/ogg':
            this.nftType = 'audio';
            break;
          default:
            this.nftType = '';
        }
      }
      this.loading = false;
    });
  }

  getDataTable(nextKey = null) {
    let filterData = {};
    filterData['keyWord'] = this.nftId;
    this.tokenService.getListTokenTransferIndexer(100, this.contractAddress, filterData, nextKey).subscribe((res) => {
      const { code, data } = res;
      this.nextKey = data.nextKey || null;

      if (code === 200) {
        res.data.transactions.forEach((trans) => {
          trans = parseDataTransaction(trans, this.coinMinimalDenom, this.contractAddress);
        });
        this.dataSource.data = res.data.transactions;
        this.pageData.length = res.data?.count;
      }
      this.loading = false;
    });
  }

  paginatorEmit(event): void {
    this.dataSource.paginator = event;
  }

  handlePageEvent(e: any) {
    const { length, pageIndex, pageSize } = e;
    const next = length <= (pageIndex + 2) * pageSize;
    this.pageData = e;
    if (next && this.nextKey && this.currentKey !== this.nextKey) {
      this.getDataTable(this.nextKey);
      this.currentKey = this.nextKey;
    }
  }

  copyData(text: string) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    // fake event click out side copy button
    // this event for hidden tooltip
    setTimeout(function () {
      document.getElementById('popupCopy').click();
    }, 800);
  }

  getPopoverData(data): IContractPopoverData {
    return {
      amount: data?.value || 0,
      code: Number(data?.tx_response?.code),
      fee: data?.fee || 0,
      from_address: data?.from_address || '',
      to_address: data?.to_address || '',
      price: 0,
      status: data?.status,
      symbol: this.denom,
      // tokenAddress: this.contractInfo?.contractsAddress,
      tokenAddress: '',
      tx_hash: data?.tx_hash || '',
      gas_used: data?.tx_response?.gas_used,
      gas_wanted: data?.tx_response?.gas_wanted,
      nftDetail: this.nftDetail,
      modeExecute: data?.modeExecute,
    };
  }

  isContractAddress(type, address) {
    if (LIST_TYPE_CONTRACT_ADDRESS.includes(type) && address?.length > LENGTH_CHARACTER.ADDRESS) {
      return true;
    }
    return false;
  }
}
