import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { BandejaService } from '../Tramites/services/bandeja.service';
import { SocketService } from '../Tramites/services/socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  Menu: any = this.authService.Menu

  private _mobileQueryListener: () => void;


  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public authService: AuthService,
    private socketService: SocketService,
    private bandejaService: BandejaService,
    private toastr: ToastrService,
  ) {
    this.socketService.setupSocketConnection();
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery!.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // escuchar ingreso de usuarios
    this.socketService.SocketOn_JoinUser().subscribe((users: any) => {
      this.socketService.Users = users
    })
    this.socketService.SocketOn_Mails().subscribe((data: any) => {
      this.toastr.info('Nuevo', 'Nuevo tramite recibido', {
        positionClass: 'toast-bottom-right',
        timeOut: 3000,
      })
      let aux = [...this.bandejaService.dataSource]
      aux.push(data)

      this.bandejaService.dataSource = aux
    })

    // emitir solicitiud de ingreso recibiendo los users activos como respuesta
    this.socketService.socket.emit('unirse', this.authService.Detalles_Cuenta, (users: any) => {
      this.socketService.Users = users
    })

  }



}
