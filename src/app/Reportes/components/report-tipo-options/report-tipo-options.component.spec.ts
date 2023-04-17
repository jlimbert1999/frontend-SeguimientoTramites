import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTipoOptionsComponent } from './report-tipo-options.component';

describe('ReportTipoOptionsComponent', () => {
  let component: ReportTipoOptionsComponent;
  let fixture: ComponentFixture<ReportTipoOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTipoOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTipoOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
