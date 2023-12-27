import { ChangeDetectorRef, Component, ViewChild, effect } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AlertService } from 'src/app/shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('snav') public sidenav: MatSidenav;
  mobileQuery: MediaQueryList;
  navigation = this.authService.menu();
  private _mobileQueryListener: () => void;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router,
    private appearanceService: AppearanceService,
    private alertService: AlertService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    effect(() => {
      if (this.sidenav) this.sidenav.toggle();
      return this.appearanceService.toggleSidenav();
    });
    this.socketService.setupSocketConnection();
  }

  ngOnInit(): void {
    this.socketService.listenUserConnection();
    this.listenMails();
  }

  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  get isLoaging() {
    return this.appearanceService.loading();
  }
  editAccount() {
    this.router.navigate(['home/perfil', this.authService.account()?.id_account]);
  }

  listenMails() {
    this.socketService
      .listenMails()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ emitter }) => {
        this.alertService.showInfoToast({
          title: 'NUEVO TRAMITE RECIBIDO',
          message: `${emitter.fullname} ha enviado un tramite`,
          onActionRouteNavigate: '/bandejas/entrada',
        });
      });
  }
  listenUserConnections() {
    // this.userSubscription = this.socketService.onlineUsers$.subscribe();
  }
  logout() {
    this.authService.logout();
    this.socketService.disconnect();
  }

  get currentUser() {
    return this.authService.account();
  }
}
