import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideRight } from './side-right';

describe('SideRight', () => {
  let component: SideRight;
  let fixture: ComponentFixture<SideRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideRight],
    }).compileComponents();

    fixture = TestBed.createComponent(SideRight);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
