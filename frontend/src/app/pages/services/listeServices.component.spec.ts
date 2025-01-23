import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeServicesComponent } from './listeServices.component';

describe('ListeServicesComponent', () => {
  let component: ListeServicesComponent;
  let fixture: ComponentFixture<ListeServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeServicesComponent]
    });
    fixture = TestBed.createComponent(ListeServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
