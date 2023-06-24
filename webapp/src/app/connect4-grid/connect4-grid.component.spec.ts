import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Connect4GridComponent } from './connect4-grid.component';

describe('Connect4GridComponent', () => {
  let component: Connect4GridComponent;
  let fixture: ComponentFixture<Connect4GridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Connect4GridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Connect4GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
