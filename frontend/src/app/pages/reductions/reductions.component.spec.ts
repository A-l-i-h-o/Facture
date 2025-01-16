import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionsComponent } from './reductions.component';

describe('ReductionsComponent', () => {
  let component: ReductionsComponent;
  let fixture: ComponentFixture<ReductionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReductionsComponent]
    });
    fixture = TestBed.createComponent(ReductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
