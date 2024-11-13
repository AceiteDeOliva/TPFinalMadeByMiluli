import { MercadopagoService } from './mercadopago.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MercadopagoService', () => {
  let service: MercadopagoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercadopagoService]
    });
    service = TestBed.inject(MercadopagoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createPreference with the correct parameters', () => {
    const preferenceData = { title: 'Test Product', quantity: 1, unit_price: 100 };
    service.createPreference(preferenceData).subscribe();

    const req = httpMock.expectOne('http://localhost:3002/create_preference');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(preferenceData);
  });
});
