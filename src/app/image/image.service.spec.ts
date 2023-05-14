import { TestBed, inject } from '@angular/core/testing';
import { ImageService } from './image.service';

describe('UploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageService]
    });
  });

  it('should ...', inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));
});