import { ChangeDetectorRef, Component, ViewChild, effect } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('snav') public sidenav: MatSidenav;
  mobileQuery: MediaQueryList;
  navigation = this.authService.menu();
  private mailSubscription: Subscription;
  private userSubscription: Subscription;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router,
    private appearanceService: AppearanceService,
    private pagina: PaginatorService
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
    // this.listenUserConnections();
  }

  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
    if (this.mailSubscription) this.mailSubscription.unsubscribe();
  }
  get isLoaging() {
    return this.appearanceService.loading();
  }
  editAccount() {
    this.router.navigate(['home/perfil', this.authService.account()?.id_account]);
  }

  listenMails() {
    console.log(this.socketService.mailSubscription$());
    // this.socketService.listenMails();
    // this.mailSubscription = this.socketService.mailSubscription$.subscribe((data) => {
    //   this.toastService.showToast({
    //     title: 'NUEVO TRAMITE RECIBIDO',
    //     message: `${data.emitter.fullname} ha enviado un tramite`,
    //     onActionRouteNavigate: '/',
    //   });
    // });
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

  get cache() {
    return this.pagina.cache;
  }
}
