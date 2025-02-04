import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreationFraisComponent } from './creation-frais.component';
import { FactureService } from 'src/app/http/FactureService';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreationFraisComponent', () => {
  let component: CreationFraisComponent;
  let fixture: ComponentFixture<CreationFraisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationFraisComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        FactureService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.fraisForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.fraisForm;
    form.controls['montant'].setValue(100);
    form.controls['description'].setValue('Test Frais');
    form.controls['type'].setValue('Test Type');
    form.controls['dateCreation'].setValue(new Date());
    
    expect(form.valid).toBeTruthy();
  });
});
