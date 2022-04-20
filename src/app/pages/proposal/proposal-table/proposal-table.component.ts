import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/core/services/common.service';
import { TableTemplate } from '../../../../app/core/models/common.model';
import { shortenAddress } from '../../../../app/core/utils/common/shorten';
import { DATEFORMAT } from '../../../core/constants/common.constant';
import { PROPOSAL_VOTE } from '../../../core/constants/proposal.constant';
import { formatTimeInWords, formatWithSchema } from '../../../core/helpers/date';
import { Globals } from '../../../global/global';

interface CustomPageEvent {
  next: number;
  type: string;
}

@Component({
  selector: 'app-proposal-table',
  templateUrl: './proposal-table.component.html',
  styleUrls: ['./proposal-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalTableComponent implements OnInit, OnChanges {
  @Input() type: 'VOTES' | 'VALIDATORS_VOTES' | 'DEPOSITORS';
  @Input() data: any[];
  @Input() length: number;

  @Output() loadMore = new EventEmitter<CustomPageEvent>();

  votesTemplates: Array<TableTemplate> = [
    { matColumnDef: 'voter', headerCellDef: 'Voter', isUrl: '/account', isShort: true },
    { matColumnDef: 'tx_hash', headerCellDef: 'TxHash', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'option', headerCellDef: 'Answer' },
    { matColumnDef: 'created_at', headerCellDef: 'Time' },
  ];

  validatorsVotesTemplates: Array<TableTemplate> = [
    { matColumnDef: 'rank', headerCellDef: 'Rank' },
    {
      matColumnDef: 'validator_name',
      headerCellDef: 'Validator',
      isUrl: '/validators',
      paramField: 'operator_address',
    },
    { matColumnDef: 'tx_hash', headerCellDef: 'TxHash', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'option', headerCellDef: 'Answer' },
    { matColumnDef: 'created_at', headerCellDef: 'Time' },
  ];

  depositorsTemplates: Array<TableTemplate> = [
    { matColumnDef: 'depositor', headerCellDef: 'Depositors', isUrl: '/account', isShort: true },
    { matColumnDef: 'tx_hash', headerCellDef: 'TxHash', isUrl: '/transaction', isShort: true },
    { matColumnDef: 'amount', headerCellDef: 'Amount' },
    { matColumnDef: 'created_at', headerCellDef: 'Time' },
  ];

  displayedColumns: string[];
  template: Array<TableTemplate> = [];

  dataSource: MatTableDataSource<any>;
  pageSize = 5;
  pageIndex = 0;

  constructor(public global: Globals, public commonService: CommonService) {}

  ngOnChanges(): void {
    if (this.dataSource) {
      this.dataSource.data = this.data;
    } else {
      this.dataSource = new MatTableDataSource(this.data);
    }
  }

  ngOnInit(): void {
    this.template = this.getTemplate(this.type);
    this.displayedColumns = this.getTemplate(this.type).map((template) => template.matColumnDef);

    this.dataSource = new MatTableDataSource(this.data);
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
    if (address) {
      return shortenAddress(address, 8);
    }
    return '';
  }

  getVoteValue(voteKey) {
    const vote = PROPOSAL_VOTE.find((vote) => vote.key === voteKey);
    return vote ? vote.value : 'Did not vote';
  }

  pageEvent(e: PageEvent): void {
    const { length, pageIndex, pageSize } = e;
    const next = length <= pageIndex * pageSize;

    if (next) {
      this.loadMore.emit({
        next: 1,
        type: this.type,
      });
    }
  }

  paginatorEmit(e): void {
    if (this.dataSource) {
      this.dataSource.paginator = e;
    } else {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = e;
    }
  }
}
