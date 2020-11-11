import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpzItemComponent } from './dpz-item.component';

describe('DpzItemComponent', () => {
  let component: DpzItemComponent;
  let fixture: ComponentFixture<DpzItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpzItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpzItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
