import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import io, { Socket } from 'socket.io-client';
import { EnvironmentService } from 'src/app/core/data-services/environment.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { NgxToastrService } from 'src/app/core/services/ngx-toastr.service';

@Injectable({
  providedIn: 'root',
})
export class WSService {
  socketUrl = `${this.environmentService.apiUrl.value.urlSocket}`;

  public wsData: BehaviorSubject<any>;
  public data$: Observable<any>;

  socket: Socket;

  constructor(
    private environmentService: EnvironmentService,
    private toastr: NgxToastrService,
    private router: Router,
  ) {
    this.wsData = new BehaviorSubject<any>(null);
    this.data$ = this.wsData.asObservable();
  }

  public get wsDataValue() {
    return this.wsData.value;
  }

  public connect(): void {
    this.socket = io(this.socketUrl, {
      path: '/ws/socket.io',
      autoConnect: true,
    });
  }

  public on(name: string, data: any) {
    this.socket.emit(name, data);
    return new Observable((subscriber) => {
      this.socket.on(name, () => {
        this.socket.on(data?.event, (res) => {
          subscriber.next(res);
        });
      });
    });
  }

  public disconnect() {
    this.socket?.on('disconnect', (reason) => {
      // ...
      console.log('reason disconnect', reason);
    });
  }

  public reconnect() {
    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
  }

  subscribeVerifyContract(contractAdr) {
    this.connect();

    const wsData = { event: 'eventVerifyContract' };

    this.on('register', wsData).subscribe((data: any) => {
      const { Verified } = (data && JSON.parse(data)) || { Verified: false };
      if (Verified) {
        this.toastr
          .successWithTap('Contract Source Code Verification is successful! Click here to view detail')
          .pipe(take(1))
          .subscribe((_) => {
            this.router.navigate(['contracts', contractAdr], {
              queryParams: {
                tabId: 'contract',
              },
              state: {
                reload: true,
              },
            });
          });
      } else {
        this.toastr.error(`Error! Unable to generate Contract Creation Code and Schema for Contract ${contractAdr}`);
      }
    });
  }
}
