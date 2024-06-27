import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingFeedComponent } from './following-feed.component';

describe('FollowingFeedComponent', () => {
  let component: FollowingFeedComponent;
  let fixture: ComponentFixture<FollowingFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowingFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowingFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
