import { SanitizeFileUrlPipe } from './sanitize-file-url.pipe';

describe('SanitizeFileUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeFileUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
