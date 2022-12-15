import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailFichaComponent } from './mail-ficha.component';

describe('MailFichaComponent', () => {
  let component: MailFichaComponent;
  let fixture: ComponentFixture<MailFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailFichaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
