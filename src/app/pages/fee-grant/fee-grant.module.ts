import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonPipeModule } from 'src/app/core/pipes/common-pipe.module';
import { PaginatorModule } from 'src/app/shared/components/paginator/paginator.module';
import { TableNoDataModule } from 'src/app/shared/components/table-no-data/table-no-data.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeeGrantRoutingModule } from './fee-grant-routing.module';
import { FeeGrantComponent } from './fee-grant.component';
import { MyGranteesComponent } from './my-grantees/my-grantees.component';
import { MyGrantersComponent } from './my-granters/my-granters.component';
import { PopupAddGrantComponent } from './popup-add-grant/popup-add-grant.component';
import { PopupRevokeComponent } from './popup-revoke/popup-revoke.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ClickOutsideModule} from "ng-click-outside";
import { FeeGrantService } from 'src/app/core/services/feegrant.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { MappingErrorService } from 'src/app/core/services/mapping-error.service';
import { AccountService } from 'src/app/core/services/account.service';

@NgModule({
  declarations: [
    FeeGrantComponent,
    MyGranteesComponent,
    MyGrantersComponent,
    PopupAddGrantComponent,
    PopupRevokeComponent,
  ],
  imports: [
    CommonModule,
    FeeGrantRoutingModule,
    NgbNavModule,
    FormsModule,
    CommonPipeModule,
    MatTableModule,
    PaginatorModule,
    TableNoDataModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    ClickOutsideModule
  ],
  providers: [FormBuilder, FeeGrantService, TransactionService, MappingErrorService, AccountService]
})
export class FeeGrantModule {}
