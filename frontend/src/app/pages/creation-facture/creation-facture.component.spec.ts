import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreationFactureComponent } from './creation-facture.component';
import { FactureService } from 'src/app/http/FactureService';

describe('CreationFactureComponent', () => {
  let component: CreationFactureComponent;
  let fixture: ComponentFixture<CreationFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationFactureComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [FactureService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.factureForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.factureForm;
    form.controls['description'].setValue('Test Facture');
    form.controls['creancier'].setValue('Test Creancier');
    form.controls['dateCreation'].setValue(new Date());
    form.controls['idPeriode'].setValue(1);
    form.controls['debiteur'].setValue('Test Debiteur');
    form.controls['dateEcheance'].setValue(new Date());
    
    expect(form.valid).toBeTruthy();
  });
});
