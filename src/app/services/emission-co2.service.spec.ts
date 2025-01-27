import { TestBed } from '@angular/core/testing';

import { EmissionCo2Service } from './emission-co2.service';

describe('EmissionCo2Service', () => {
  let service: EmissionCo2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmissionCo2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
