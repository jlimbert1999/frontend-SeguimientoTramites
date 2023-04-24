import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsProcedureComponent } from './events-procedure.component';

describe('EventsProcedureComponent', () => {
  let component: EventsProcedureComponent;
  let fixture: ComponentFixture<EventsProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsProcedureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
