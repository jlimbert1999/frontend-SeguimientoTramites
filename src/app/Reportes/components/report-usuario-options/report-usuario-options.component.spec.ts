import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUsuarioOptionsComponent } from './report-usuario-options.component';

describe('ReportUsuarioOptionsComponent', () => {
  let component: ReportUsuarioOptionsComponent;
  let fixture: ComponentFixture<ReportUsuarioOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportUsuarioOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportUsuarioOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
