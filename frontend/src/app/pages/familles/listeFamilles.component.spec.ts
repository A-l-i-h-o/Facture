import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFamillesComponent } from './listeFamilles.component';

describe('ListeFamillesComponent', () => {
  let component: ListeFamillesComponent;
  let fixture: ComponentFixture<ListeFamillesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeFamillesComponent]
    });
    fixture = TestBed.createComponent(ListeFamillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
