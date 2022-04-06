import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableTemplate } from '../../../../app/core/models/common.model';
import { shortenAddress } from '../../../../app/core/utils/common/shorten';

@Component({
  selector: 'app-proposal-table',
  templateUrl: './proposal-table.component.html',
  styleUrls: ['./proposal-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: 'VOTES' | 'VALIDATORS_VOTES' | 'DEPOSITORS';

  @Input() data: any;

  @ViewChild(MatSort) sort: MatSort;
  votesTemplates: Array<TableTemplate> = [
    { matColumnDef: 'voter', headerCellDef: 'Voter', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'txHash', headerCellDef: 'TxHash', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'answer', headerCellDef: 'Answer' },
    { matColumnDef: 'time', headerCellDef: 'Time' },
  ];

  validatorsVotesTemplates: Array<TableTemplate> = [
    { matColumnDef: 'rank', headerCellDef: 'Rank', cssClass: 'box-rank' },
    { matColumnDef: 'validator', headerCellDef: 'Validator', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'txHash', headerCellDef: 'TxHash', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'answer', headerCellDef: 'Answer' },
    { matColumnDef: 'time', headerCellDef: 'Time' },
  ];

  depositorsTemplates: Array<TableTemplate> = [
    { matColumnDef: 'depositors', headerCellDef: 'Depositors', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'txHash', headerCellDef: 'TxHash', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'amount', headerCellDef: 'Amount' },
    { matColumnDef: 'time', headerCellDef: 'Time' },
  ];

  displayedColumns: string[];

  template: Array<TableTemplate> = [];

  dataSource: MatTableDataSource<any>;
  length;
  pageSize = 20;
  pageIndex = 0;

  constructor() {}
  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.template = this.getTemplate(this.type);
    this.displayedColumns = this.getTemplate(this.type).map((template) => template.matColumnDef);

    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
  }

  getTemplate(type: 'VOTES' | 'VALIDATORS_VOTES' | 'DEPOSITORS'): Array<TableTemplate> {
    switch (type) {
      case 'VOTES':
        return this.votesTemplates;
      case 'DEPOSITORS':
        return this.depositorsTemplates;
      case 'VALIDATORS_VOTES':
        return this.validatorsVotesTemplates;
      default:
        return [];
    }
  }

  shortenAddress(address: string): string {
    return shortenAddress(address, 8);
  }
}
