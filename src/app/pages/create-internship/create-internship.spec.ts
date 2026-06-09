import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInternship } from './create-internship';

describe('CreateInternship', () => {
  let component: CreateInternship;
  let fixture: ComponentFixture<CreateInternship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInternship],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInternship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
