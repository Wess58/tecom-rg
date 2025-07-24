import { TestBed } from '@angular/core/testing';

import { ComprssNConvrtService } from './comprss-n-convrt.service';

describe('ComprssNConvrtService', () => {
  let service: ComprssNConvrtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprssNConvrtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
