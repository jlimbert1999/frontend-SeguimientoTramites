import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFichaOptionsComponent } from './report-ficha-options.component';

describe('ReportFichaOptionsComponent', () => {
  let component: ReportFichaOptionsComponent;
  let fixture: ComponentFixture<ReportFichaOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFichaOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFichaOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
