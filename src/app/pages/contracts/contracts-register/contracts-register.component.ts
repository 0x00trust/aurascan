import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ContractVerifyType } from 'src/app/core/constants/contract.enum';
import { DATEFORMAT, PAGE_EVENT } from '../../../core/constants/common.constant';
import { MAX_LENGTH_SEARCH_TOKEN } from '../../../core/constants/token.constant';
import { TableTemplate } from '../../../core/models/common.model';
import { ContractService } from '../../../core/services/contract.service';
import { shortenAddress } from '../../../core/utils/common/shorten';
import { Globals } from '../../../global/global';

@Component({
  selector: 'app-contracts-register',
  templateUrl: './contracts-register.component.html',
  styleUrls: ['./contracts-register.component.scss'],
})
export class ContractsRegisterComponent implements OnInit {
  textSearch = '';
  templates: Array<TableTemplate> = [
    { matColumnDef: 'codeID', headerCellDef: 'Code ID' },
    { matColumnDef: 'typeContract', headerCellDef: 'Type Contract' },
    { matColumnDef: 'result', headerCellDef: 'Result registration' },
    { matColumnDef: 'time', headerCellDef: 'Time Registered' },
    { matColumnDef: 'action', headerCellDef: '' },
  ];
  displayedColumns: string[] = this.templates.map((dta) => dta.matColumnDef);
  pageData: PageEvent;
  pageSize = 20;
  pageIndex = 0;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSearch: any;
  filterSearchData = [];
  maxLengthSearch = MAX_LENGTH_SEARCH_TOKEN;
  contractVerifyType = ContractVerifyType;
  breakpoint$ = this.layout.observe([Breakpoints.Small, Breakpoints.XSmall]);
  currentValidatorDialog: string;
  modalReference: any;

  // data table
  mockData = [
    {
      codeID: '1',
      typeContract: 'CW20 Contract',
      result: 'Correct',
      time: moment().subtract(100, 's').toDate(),
    },
    {
      codeID: '6',
      typeContract: 'CW721 Contract',
      result: 'Incorrect',
      time: moment().subtract(100, 's').toDate(),
    },
    {
      codeID: '8',
      typeContract: 'CW20 Contract',
      result: 'TBD',
      time: moment().subtract(100, 's').toDate(),
    },
    {
      codeID: '13',
      typeContract: 'CW20 Contract',
      result: 'Correct',
      time: moment().subtract(100, 's').toDate(),
    },
    {
      codeID: '21',
      typeContract: 'CW20 Contract',
      result: 'Correct',
      time: moment().subtract(100, 's').toDate(),
    },
  ];

  constructor(
    public translate: TranslateService,
    public global: Globals,
    private router: Router,
    private contractService: ContractService,
    private datePipe: DatePipe,
    private layout: BreakpointObserver,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getListContract();
  }

  getListContract() {
    let payload = {
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      keyword: this.textSearch,
    };

    this.contractService.getListContract(payload).subscribe((res) => {
      this.pageData = {
        length: res?.meta?.count,
        pageSize: 20,
        pageIndex: PAGE_EVENT.PAGE_INDEX,
      };
      if (res?.data?.length > 0) {
        res.data.forEach((item) => {
          item.updated_at = this.datePipe.transform(item.updated_at, DATEFORMAT.DATETIME_UTC);
        });
        this.dataSource = res.data;
        this.dataSearch = res.data;
      }
    });
  }

  searchToken(): void {
    this.filterSearchData = null;
    if (this.textSearch.length > 0) {
      let payload = {
        limit: 0,
        offset: 0,
        keyword: this.textSearch,
      };

      this.contractService.getListContract(payload).subscribe((res) => {
        if (res?.data?.length > 0) {
          res.data.forEach((item) => {
            item.updated_at = this.datePipe.transform(item.updated_at, DATEFORMAT.DATETIME_UTC);
          });
          this.dataSearch = res.data;
        }
      });
      let keyWord = this.textSearch.toLowerCase();
      this.filterSearchData = this.dataSearch.filter((data) => data.contract_name.toLowerCase().includes(keyWord));
    }
  }

  paginatorEmit(event): void {
    this.dataSource.paginator = event;
  }

  pageEvent(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.getListContract();
  }

  handleLink(): void {
    this.router.navigate(['/contracts/', this.filterSearchData[0]?.contract_address]);
  }

  shortenAddress(address: string): string {
    if (address) {
      return shortenAddress(address, 8);
    }
    return '';
  }

  viewPopupDetail(staticDataModal: any, address: string, isOpenStaking = false) {
    this.modalReference = this.modalService.open(staticDataModal, {
      keyboard: false,
      centered: true,
      windowClass: 'modal-holder',
    });
  }
}
