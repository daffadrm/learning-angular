import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLabelDetailComponent } from './master-label-detail.component';

describe('MasterLabelDetailComponent', () => {
  let component: MasterLabelDetailComponent;
  let fixture: ComponentFixture<MasterLabelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterLabelDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterLabelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
