import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamillesComponent } from './familles.component';

describe('FamillesComponent', () => {
  let component: FamillesComponent;
  let fixture: ComponentFixture<FamillesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamillesComponent]
    });
    fixture = TestBed.createComponent(FamillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
