import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionDialogComponent } from './institucion-dialog.component';

describe('InstitucionDialogComponent', () => {
  let component: InstitucionDialogComponent;
  let fixture: ComponentFixture<InstitucionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitucionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitucionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
