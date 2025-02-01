import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeReductionsComponent } from './listeReductions.component';

describe('ListeReductionsComponent', () => {
  let component: ListeReductionsComponent;
  let fixture: ComponentFixture<ListeReductionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeReductionsComponent]
    });
    fixture = TestBed.createComponent(ListeReductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
