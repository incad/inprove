import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VdkItemComponent } from './vdk-item.component';

describe('VdkItemComponent', () => {
  let component: VdkItemComponent;
  let fixture: ComponentFixture<VdkItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VdkItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VdkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
