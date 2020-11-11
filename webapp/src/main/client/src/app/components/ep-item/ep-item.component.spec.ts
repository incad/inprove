import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpItemComponent } from './ep-item.component';

describe('EpItemComponent', () => {
  let component: EpItemComponent;
  let fixture: ComponentFixture<EpItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
