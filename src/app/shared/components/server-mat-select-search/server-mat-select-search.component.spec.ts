import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerMatSelectSearchComponent } from './server-mat-select-search.component';

describe('ServerMatSelectSearchComponent', () => {
  let component: ServerMatSelectSearchComponent;
  let fixture: ComponentFixture<ServerMatSelectSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerMatSelectSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerMatSelectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
