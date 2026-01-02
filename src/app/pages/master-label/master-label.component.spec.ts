import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLabelComponent } from './master-label.component';

describe('MasterLabelComponent', () => {
  let component: MasterLabelComponent;
  let fixture: ComponentFixture<MasterLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
