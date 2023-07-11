import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionDialogComponent } from './institution-dialog.component';

describe('InstitutionDialogComponent', () => {
  let component: InstitutionDialogComponent;
  let fixture: ComponentFixture<InstitutionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
