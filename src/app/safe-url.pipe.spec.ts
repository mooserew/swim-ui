import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']) as unknown as DomSanitizer;
  });

  it('create an instance', () => {
    const pipe = new SafeUrlPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
