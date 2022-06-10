import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CONTRACT_TABLE_TEMPLATES } from 'src/app/core/constants/contract.constant';
import { ContractTransactionType } from 'src/app/core/constants/contract.enum';
import { TRANSACTION_TYPE_ENUM } from 'src/app/core/constants/transaction.enum';
import { IResponsesSuccess, TableTemplate } from 'src/app/core/models/common.model';
import { IContractsResponse, ITableContract } from 'src/app/core/models/contract.model';
import { ContractService } from 'src/app/core/services/contract.service';
import { balanceOf, parseLabel } from 'src/app/core/utils/common/parsing';
import { isContract } from 'src/app/core/utils/common/validation';
import { TableData } from 'src/app/shared/components/contract-table/contract-table.component';

@Component({
  selector: 'app-contracts-transactions',
  templateUrl: './contracts-transactions.component.html',
  styleUrls: ['./contracts-transactions.component.scss'],
})
export class ContractsTransactionsComponent implements OnInit {
  templates: Array<TableTemplate> = CONTRACT_TABLE_TEMPLATES;

  contractInfo: ITableContract = {
    contractsAddress: '',
    count: 0,
    popover: true,
  };

  queryParams: {
    offset: number;
    label: number | string;
  } = {
    offset: 0,
    label: '',
  };

  contractTransactionType = ContractTransactionType;

  contract$ = combineLatest([this.activeRouter.params, this.activeRouter.queryParams]).pipe(
    map((result) => ({
      params: result[0],
      queryParams: result[1],
    })),
    mergeMap(({ params, queryParams }) => {
      if (isContract(params?.addressId)) {
        this.contractInfo.contractsAddress = params?.addressId;
        let payload = {
          limit: 25,
          offset: +queryParams['offset'] || 0,
          label: parseLabel(queryParams['label'] || ''),
          contract_address: params.addressId,
        };

        this.queryParams = {
          offset: +queryParams['offset'] || 0,
          label: queryParams['label'],
        };

        return this.contractService.getTransactions(payload);
      }
      this.router.navigate(['']);
      return of(null);
    }),
    map((res: IResponsesSuccess<IContractsResponse[]>) => res && this.checkResponse(res)),
  );

  constructor(
    public translate: TranslateService,
    private router: Router,
    private contractService: ContractService,
    private activeRouter: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  onChangePage(event) {
    this.router.navigate([`/contracts/transactions`, this.contractInfo.contractsAddress], {
      queryParams: {
        label: this.queryParams?.label || '',
        offset: (event?.next || 0) * 25,
      },
    });
  }

  filterTransaction(event): void {
    if (event?.key) {
      this.router.navigate([`/contracts/transactions`, this.contractInfo.contractsAddress], {
        queryParams: {
          label: event.key,
        },
      });
    } else {
      this.router.navigate([`/contracts/transactions`, this.contractInfo.contractsAddress]);
    }
  }

  checkResponse(response): TableData[] {
    if (response.data && Array.isArray(response.data)) {
      this.contractInfo.count = response.meta.count || 0;
      const ret = response.data.map((contract) => {
        let value = 0;
        let from = '';
        let to = '';
        let method = '';
        switch (contract.type) {
          case TRANSACTION_TYPE_ENUM.InstantiateContract:
            method = 'instantiate';
            break;
          case TRANSACTION_TYPE_ENUM.Send:
            method = 'transfer';
            value = +contract.messages[0]?.amount[0].amount;
            from = contract.messages[0].from_address;
            to = contract.messages[0].to_address;
            break;
          case TRANSACTION_TYPE_ENUM.ExecuteContract:
            method = Object.keys(contract.messages[0].msg)[0];
            value = +contract.messages[0].funds[0]?.amount;
            from = contract.messages[0].sender;
            to = contract.messages[0].contract;
            break;
          default:
            method = Object.keys(contract.messages[0].msg)[0];
            value = 0;
            from = contract.messages[0].sender;
            to = contract.messages[0].contract;
            break;
        }

        const label =
          contract.messages[0].sender === this.contractInfo.contractsAddress
            ? ContractTransactionType.OUT
            : ContractTransactionType.IN;

        const tableDta: TableData = {
          txHash: contract.tx_hash,
          method,
          blockHeight: contract.height,
          blockId: contract.blockId,
          time: new Date(contract.timestamp),
          from,
          label,
          to,
          value: balanceOf(value),
          fee: +contract.fee,
          gas_used: +contract.gas_used,
          gas_wanted: +contract.gas_wanted,
        };

        return tableDta;
      });

      return ret;
    }

    return null;
  }
}
