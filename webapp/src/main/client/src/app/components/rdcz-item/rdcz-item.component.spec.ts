import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdczItemComponent } from './rdcz-item.component';

describe('RdczItemComponent', () => {
  let component: RdczItemComponent;
  let fixture: ComponentFixture<RdczItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdczItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdczItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
