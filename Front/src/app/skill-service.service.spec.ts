import { TestBed } from '@angular/core/testing';

import { SkillServiceService } from './skill-service.service';

describe('SkillServiceService', () => {
  let service: SkillServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
