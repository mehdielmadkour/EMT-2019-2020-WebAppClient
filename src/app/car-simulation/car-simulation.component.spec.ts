import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSimulationComponent } from './car-simulation.component';

describe('CarSimulationComponent', () => {
  let component: CarSimulationComponent;
  let fixture: ComponentFixture<CarSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
