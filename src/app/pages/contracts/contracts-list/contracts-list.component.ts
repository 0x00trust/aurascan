import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CONTRACT_RESULT } from 'src/app/core/constants/contract.constant';
import { ContractVerifyType } from 'src/app/core/constants/contract.enum';
import { EnvironmentService } from 'src/app/core/data-services/environment.service';
import { DATEFORMAT, PAGE_EVENT } from '../../../core/constants/common.constant';
import { MAX_LENGTH_SEARCH_TOKEN } from '../../../core/constants/token.constant';
import { TableTemplate } from '../../../core/models/common.model';
import { ContractService } from '../../../core/services/contract.service';
import { shortenAddress } from '../../../core/utils/common/shorten';
import { Globals } from '../../../global/global';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss'],
})
export class ContractsListComponent implements OnInit, OnDestroy {
  textSearch = '';
  searchMobVisible = false;
  templates: Array<TableTemplate> = [
    { matColumnDef: 'contract_address', headerCellDef: 'Address', isUrl: '/contracts', isShort: true },
    { matColumnDef: 'contract_name', headerCellDef: 'Contract Name' },
    { matColumnDef: 'code_id', headerCellDef: 'Code ID' },
    { matColumnDef: 'project_name', headerCellDef: 'Project' },
    { matColumnDef: 'type', headerCellDef: 'Type Contract' },
    { matColumnDef: 'compiler_version', headerCellDef: 'Version' },
    { matColumnDef: 'contract_verification', headerCellDef: 'Verified' },
    { matColumnDef: 'creator_address', headerCellDef: 'Creator', isUrl: '/account', isShort: true },
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
  urlParam = '';
  showBoxSearch = false;

  image_s3 = this.environmentService.configValue.image_s3;
  defaultLogoToken = this.image_s3 + 'images/icons/token-logo.png';

  searchSubject = new Subject<string>();
  searchSubscription: Subscription;

  constructor(
    public translate: TranslateService,
    public global: Globals,
    private router: Router,
    private contractService: ContractService,
    private datePipe: DatePipe,
    private layout: BreakpointObserver,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService
  ) {}

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.urlParam = params.param;
    });
    this.textSearch = this.urlParam ? this.urlParam : '';
    this.getListContract();

    this.searchSubscription = this.searchSubject
      .asObservable()
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((text) => {
          this.showBoxSearch = true;

          this.textSearch = text;
          let payload = {
            limit: 0,
            offset: 0,
            keyword: this.textSearch,
          };

          this.filterSearchData = [];

          return this.contractService.getListContract(payload);
        }),
      )
      .subscribe((res) => {
        if (res?.data?.length > 0) {
          res.data.forEach((item) => {
            item.updated_at = this.datePipe.transform(item.updated_at, DATEFORMAT.DATETIME_UTC);
          });
          this.filterSearchData = res.data;
        }
      });
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
          if (item.result === CONTRACT_RESULT.INCORRECT || !item.type) {
            item.type = '-';
          } else if (item.result === CONTRACT_RESULT.TBD) {
            item.type = CONTRACT_RESULT.TBD;
          }
        });
        this.dataSource = res.data;
        this.dataSearch = res.data;
      }
    });
  }

  paginatorEmit(event): void {
    this.dataSource.paginator = event;
  }

  pageEvent(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    if (!this.urlParam) {
      this.textSearch = '';
      this.showBoxSearch = false;
    }
    this.getListContract();
  }

  handleLink(): void {
    if (this.filterSearchData[0]?.contract_address) {
      this.router.navigate(['/contracts/', this.filterSearchData[0]?.contract_address]);
    }
  }

  shortenAddress(address: string): string {
    if (address) {
      return shortenAddress(address, 8);
    }
    return '';
  }

  resetFilterSearch() {
    this.textSearch = '';
    this.showBoxSearch = false;
    this.filterSearchData = [];
  }
}
