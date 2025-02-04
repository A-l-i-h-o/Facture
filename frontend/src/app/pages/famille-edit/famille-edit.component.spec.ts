import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleEditComponent } from './famille-edit.component';

describe('FamilleEditComponent', () => {
  let component: FamilleEditComponent;
  let fixture: ComponentFixture<FamilleEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilleEditComponent]
    });
    fixture = TestBed.createComponent(FamilleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
