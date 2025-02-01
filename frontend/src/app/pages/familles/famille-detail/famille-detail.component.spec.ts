import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleDetailComponent } from './famille-detail.component';

describe('FamilleDetailComponent', () => {
  let component: FamilleDetailComponent;
  let fixture: ComponentFixture<FamilleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilleDetailComponent]
    });
    fixture = TestBed.createComponent(FamilleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
