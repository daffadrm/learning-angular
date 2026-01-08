import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricListComponent } from './fabric-list.component';

describe('FabricListComponent', () => {
  let component: FabricListComponent;
  let fixture: ComponentFixture<FabricListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabricListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
