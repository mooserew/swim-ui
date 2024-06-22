import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentFeedComponent } from './comment-feed.component';

describe('CommentFeedComponent', () => {
  let component: CommentFeedComponent;
  let fixture: ComponentFixture<CommentFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
