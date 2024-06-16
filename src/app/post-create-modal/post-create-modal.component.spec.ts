import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreateModalComponent } from './post-create-modal.component';

describe('PostCreateModalComponent', () => {
  let component: PostCreateModalComponent;
  let fixture: ComponentFixture<PostCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
