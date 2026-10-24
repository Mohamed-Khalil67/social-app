import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideLeft } from './side-left';

describe('SideLeft', () => {
  let component: SideLeft;
  let fixture: ComponentFixture<SideLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideLeft],
    }).compileComponents();

    fixture = TestBed.createComponent(SideLeft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
