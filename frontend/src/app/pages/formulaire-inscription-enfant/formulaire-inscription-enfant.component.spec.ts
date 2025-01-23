import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireInscriptionEnfantComponent } from './formulaire-inscription-enfant.component';

describe('FormulaireInscriptionEnfantComponent', () => {
  let component: FormulaireInscriptionEnfantComponent;
  let fixture: ComponentFixture<FormulaireInscriptionEnfantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaireInscriptionEnfantComponent]
    });
    fixture = TestBed.createComponent(FormulaireInscriptionEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
