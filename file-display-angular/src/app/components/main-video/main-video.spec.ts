import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainVideo } from './main-video';

describe('MainVideo', () => {
  let component: MainVideo;
  let fixture: ComponentFixture<MainVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
