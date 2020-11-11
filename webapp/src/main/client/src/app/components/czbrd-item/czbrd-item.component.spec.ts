import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CzbrdItemComponent } from './czbrd-item.component';

describe('CzbrdItemComponent', () => {
  let component: CzbrdItemComponent;
  let fixture: ComponentFixture<CzbrdItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CzbrdItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CzbrdItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
