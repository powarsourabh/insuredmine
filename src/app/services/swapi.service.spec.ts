import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SwapiService } from './swapi.service';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwapiService]
    });

    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch people data using getPeople()', () => {
    const mockPeople = { results: [{ name: 'Luke Skywalker' }] };

    service.getPeople().subscribe((people) => {
      expect(people).toEqual(mockPeople);
    });

    const req = httpMock.expectOne('https://swapi.dev/api/people/');
    expect(req.request.method).toBe('GET');
    req.flush(mockPeople);
  });

  it('should fetch person data using getPerson()', () => {
    const mockPerson = { name: 'Luke Skywalker' };
    const id = 1;

    service.getPerson(id).subscribe((person) => {
      expect(person).toEqual(mockPerson);
    });

    const req = httpMock.expectOne(`https://swapi.dev/api/people/${id}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);
  });

  it('should fetch species data using getSpecies()', () => {
    const mockSpecies = { name: 'Human' };
    const url = 'https://swapi.dev/api/species/1/';

    service.getSpecies(url).subscribe((species) => {
      expect(species).toEqual(mockSpecies);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecies);
  });

  it('should fetch vehicles data using getVehicles()', () => {
    const mockVehicles = [{ name: 'Snowspeeder' }, { name: 'TIE Fighter' }];
    const urls = ['https://swapi.dev/api/vehicles/1/', 'https://swapi.dev/api/vehicles/2/'];

    service.getVehicles(urls).subscribe((vehicles) => {
      expect(vehicles).toEqual(mockVehicles);
    });

    const req1 = httpMock.expectOne(urls[0]);
    const req2 = httpMock.expectOne(urls[1]);
    expect(req1.request.method).toBe('GET');
    expect(req2.request.method).toBe('GET');
    req1.flush(mockVehicles[0]);
    req2.flush(mockVehicles[1]);
  });

  it('should fetch movies data using getMovies()', () => {
    const mockMovies = [{ title: 'A New Hope' }, { title: 'The Empire Strikes Back' }];
    const urls = ['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'];

    service.getMovies(urls).subscribe((movies) => {
      expect(movies).toEqual(mockMovies);
    });

    const req1 = httpMock.expectOne(urls[0]);
    const req2 = httpMock.expectOne(urls[1]);
    expect(req1.request.method).toBe('GET');
    expect(req2.request.method).toBe('GET');
    req1.flush(mockMovies[0]);
    req2.flush(mockMovies[1]);
  });

  it('should fetch starships data using getStarships()', () => {
    const mockStarships = [{ name: 'X-wing' }, { name: 'Millennium Falcon' }];
    const urls = ['https://swapi.dev/api/starships/1/', 'https://swapi.dev/api/starships/2/'];

    service.getStarships(urls).subscribe((starships) => {
      expect(starships).toEqual(mockStarships);
    });

    const req1 = httpMock.expectOne(urls[0]);
    const req2 = httpMock.expectOne(urls[1]);
    expect(req1.request.method).toBe('GET');
    expect(req2.request.method).toBe('GET');
    req1.flush(mockStarships[0]);
    req2.flush(mockStarships[1]);
  });
});
