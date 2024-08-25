import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CharacterDetailsComponent } from './character-details.component';
import { SwapiService } from 'src/app/services/swapi.service';

describe('CharacterDetailsComponent', () => {
  let component: CharacterDetailsComponent;
  let fixture: ComponentFixture<CharacterDetailsComponent>;
  let mockSwapiService: jasmine.SpyObj<SwapiService>;

  beforeEach(async () => {
    mockSwapiService = jasmine.createSpyObj('SwapiService', ['getPerson', 'getSpecies', 'getMovies', 'getStarships', 'getVehicles']);

    await TestBed.configureTestingModule({
      declarations: [CharacterDetailsComponent],
      providers: [
        { provide: SwapiService, useValue: mockSwapiService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    const mockCharacter = { name: 'Luke Skywalker', species: ['species-url'], films: ['film-url'], starships: ['starship-url'], vehicles: ['vehicle-url'] };
    mockSwapiService.getPerson.and.returnValue(of(mockCharacter));
    mockSwapiService.getSpecies.and.returnValue(of({ name: 'Human' }));
    mockSwapiService.getMovies.and.returnValue(of([{ title: 'A New Hope' }]));
    mockSwapiService.getStarships.and.returnValue(of([{ name: 'X-wing' }]));
    mockSwapiService.getVehicles.and.returnValue(of([{ name: 'Speeder' }]));

    fixture.detectChanges(); // Triggers ngOnInit and the lifecycle hooks

    expect(component).toBeTruthy();
  });

  it('should initialize and fetch character details on ngOnInit', fakeAsync(() => {
    const mockCharacter = { name: 'Luke Skywalker', species: ['species-url'], films: ['film-url'], starships: ['starship-url'], vehicles: ['vehicle-url'] };
    mockSwapiService.getPerson.and.returnValue(of(mockCharacter));
    mockSwapiService.getSpecies.and.returnValue(of({ name: 'Human' }));
    mockSwapiService.getMovies.and.returnValue(of([{ title: 'A New Hope' }]));
    mockSwapiService.getStarships.and.returnValue(of([{ name: 'X-wing' }]));
    mockSwapiService.getVehicles.and.returnValue(of([{ name: 'Speeder' }]));

    component.ngOnInit(); // Manually call ngOnInit after setting up mocks
    tick(); // Simulate the passage of time for async calls

    expect(component.character).toEqual(mockCharacter);
    expect(mockSwapiService.getPerson).toHaveBeenCalledWith(1);
    expect(mockSwapiService.getSpecies).toHaveBeenCalledWith('species-url');
    expect(mockSwapiService.getMovies).toHaveBeenCalledWith(['film-url']);
    expect(mockSwapiService.getStarships).toHaveBeenCalledWith(['starship-url']);
    expect(mockSwapiService.getVehicles).toHaveBeenCalledWith(['vehicle-url']);
  }));

  it('should load additional details', fakeAsync(() => {
    const mockCharacter = { name: 'Luke Skywalker', species: ['species-url'], films: ['film-url'], starships: ['starship-url'], vehicles: ['vehicle-url'] };
    component.character = mockCharacter;

    mockSwapiService.getSpecies.and.returnValue(of({ name: 'Human' }));
    mockSwapiService.getMovies.and.returnValue(of([{ title: 'A New Hope' }]));
    mockSwapiService.getStarships.and.returnValue(of([{ name: 'X-wing' }]));
    mockSwapiService.getVehicles.and.returnValue(of([{ name: 'Speeder' }]));

    component.loadAdditionalDetails();
    tick(); // Simulate the passage of time for async calls

    expect(component.species).toBe('Human');
    expect(component.movies).toEqual(['A New Hope']);
    expect(component.starships).toEqual(['X-wing']);
    expect(component.vehicles).toEqual(['Speeder']);
    expect(component.isLoading).toBeFalse();
  }));
});
