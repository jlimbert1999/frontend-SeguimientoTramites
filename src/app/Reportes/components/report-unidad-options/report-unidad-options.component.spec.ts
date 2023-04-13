import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUnidadOptionsComponent } from './report-unidad-options.component';

describe('ReportUnidadOptionsComponent', () => {
  let component: ReportUnidadOptionsComponent;
  let fixture: ComponentFixture<ReportUnidadOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportUnidadOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportUnidadOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
