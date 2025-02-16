import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DateFnsModule } from 'ngx-date-fns';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'src/app/app.module';
import { CommonPipeModule } from 'src/app/core/pipes/common-pipe.module';
import { DropdownModule } from 'src/app/shared/components/dropdown/dropdown.module';
import { PaginatorModule } from 'src/app/shared/components/paginator/paginator.module';
import { ContractPopoverModule } from 'src/app/shared/components/contract-popover/contract-popover.module';
import { TableNoDataModule } from 'src/app/shared/components/table-no-data/table-no-data.module';
import { ContractTableComponent } from './contract-table.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ContractTableComponent],
  imports: [
    CommonModule,
    NgbPopoverModule,
    PaginatorModule,
    TableNoDataModule,
    MaterialModule,
    MatTableModule,
    CommonPipeModule,
    DateFnsModule,
    NgxMaskModule,
    DropdownModule,
    RouterModule,
    ContractPopoverModule,
    SharedModule
  ],
  exports: [ContractTableComponent],
})
export class ContractTableModule {}
