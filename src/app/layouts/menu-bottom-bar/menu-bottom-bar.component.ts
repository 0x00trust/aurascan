import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SoulboundService } from 'src/app/core/services/soulbound.service';
import { WalletService } from 'src/app/core/services/wallet.service';
import { MenuName, MENU_MOB } from 'src/app/layouts/horizontaltopbar/menu';
import { MenuItem } from 'src/app/layouts/horizontaltopbar/menu.model';
import {from} from "rxjs";
import {delay, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-menu-bottom-bar',
  templateUrl: './menu-bottom-bar.component.html',
  styleUrls: ['./menu-bottom-bar.component.scss'],
})
export class MenuBottomBarComponent implements OnInit {
  menu: MenuItem[] = MENU_MOB;
  menuName = MenuName;
  menuLink = [];
  overlayPanel = false;
  wallet = null;
  lengthSBT = 0;
  isAllowInABTWhiteList = true;
  currentAddress;
  @ViewChild('popover') public popover: NgbPopover;

  constructor(
    public router: Router,
    private walletService: WalletService,
    private soulboundService: SoulboundService,
  ) {}

  ngOnInit(): void {
    this.walletService.wallet$.subscribe((wallet) => {
      if (wallet) {
        this.getListSmartContract(wallet.bech32Address);
        this.wallet = wallet;
      }
    });

    for (let menu of this.menu) {
      if (!menu.subItems) {
        this.menuLink.push(menu.link);
      } else {
        let arr = '';
        for (let subMenu of menu.subItems) {
          arr += subMenu.link;
        }
        this.menuLink.push(arr);
      }
    }
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
      // or
      return true;
    };

    // check account is in whitelist (Account Bound Token)
    from([1])
      .pipe(
        delay(800),
        mergeMap((_) => this.walletService.wallet$),
      )
      .subscribe((wallet) => {
        if (wallet) {
          this.currentAddress = this.walletService.wallet?.bech32Address;
          this.checkWL();
        } else {
          this.currentAddress = null;
          this.isAllowInABTWhiteList = false;
        }
      });
  }

  @HostListener('body:click', ['$event'])
  mouseleave(event) {
    const ids = [
      'blockChainBtn',
      'tokenBtn',
      'resourceBtn',
      'moreBtn',
      'blockChainIcon',
      'blockChainText',
      'resourceIcon',
      'resourceText',
      'tokenIcon',
      'tokenText',
      'moreIcon',
      'moreText',
    ];
    const id = event.target?.id;
    if (this.popover.isOpen()) {
      if (ids.indexOf(id) < 0) {
        const overlay = document.getElementById('popover-overlay');
        if (overlay) {
          overlay.click();
        }
      }
    }
  }

  checkWL() {
    this.soulboundService.getListWL().subscribe((res) => {
      if (!res?.data?.find((k) => k.account_address === this.currentAddress)) {
        this.isAllowInABTWhiteList = false;
      }
    });
  }

  overLayClickEvent() {
    this.overlayPanel = false;
  }

  checkMenuActive(menuLink: string) {
    if ((this.router.url === '/' || this.router.url === '/dashboard') && menuLink === '/dashboard') {
      return true;
    }

    if (!menuLink.includes('/tokens')) {
      if (menuLink === '/' + this.router.url.split('/')[1] && this.router.url.includes(menuLink)) {
        return true;
      }
    }

    if (menuLink === '/tokens' && (this.router.url == '/tokens' || this.router.url.includes('/tokens/token/'))) {
      return true;
    }

    if (
      menuLink === '/tokens/tokens-nft' &&
      (this.router.url == '/tokens/tokens-nft' || this.router.url.includes('/tokens/token-nft'))
    ) {
      return true;
    }

    if (
      menuLink === '/tokens/token-abt' &&
      (this.router.url == '/tokens/token-abt' || this.router.url.includes('/tokens/token-abt'))
    ) {
      return true;
    }

    if (
      menuLink === '/statistics/charts-stats' &&
      (this.router.url == '/statistics/charts-stats' || this.router.url.includes('/statistics/chart/'))
    ) {
      return true;
    }

    if (menuLink === '/statistics/top-statistic' && this.router.url == '/statistics/top-statistic') {
      return true;
    }

    if (
      menuLink === '/code-ids/list' &&
      (this.router.url == '/code-ids/list' ||
        this.router.url.includes('/code-ids/detail/') ||
        this.router.url.includes('/code-ids/verify/'))
    ) {
      return true;
    }
    return false;
  }

  getListSmartContract(currentAddress) {
    const payload = {
      limit: 10,
      offset: 0,
      minterAddress: currentAddress,
    };

    this.lengthSBT = 0;
    this.soulboundService.getListSoulbound(payload).subscribe((res) => {
      if (res.data.length > 0) {
        this.lengthSBT = res.meta.count;
      }
    });
  }
}
