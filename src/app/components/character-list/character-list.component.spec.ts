import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CharacterListComponent } from './character-list.component';
import { SwapiService } from 'src/app/services/swapi.service';
import { FormsModule } from '@angular/forms'; 
import { By } from '@angular/platform-browser';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  let mockSwapiService: jasmine.SpyObj<SwapiService>;
  let router: Router;

  beforeEach(async () => {
    mockSwapiService = jasmine.createSpyObj('SwapiService', ['getPeople', 'getMovies', 'getSpecies', 'getStarships', 'getVehicles']);

    await TestBed.configureTestingModule({
      declarations: [CharacterListComponent],
      imports: [FormsModule], // Import FormsModule here
      providers: [
        { provide: SwapiService, useValue: mockSwapiService },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters and populate filter options on init', fakeAsync(() => {
    const mockCharacters = [
      { name: 'Luke Skywalker', films: ['film-url'], species: ['species-url'], starships: ['starship-url'], vehicles: ['vehicle-url'] }
    ];

    // Ensure that each method returns a proper observable
    mockSwapiService.getPeople.and.returnValue(of({ results: mockCharacters }));
    mockSwapiService.getMovies.and.returnValue(of([{ title: 'A New Hope' }]));
    mockSwapiService.getSpecies.and.returnValue(of({ name: 'Human' }));
    mockSwapiService.getStarships.and.returnValue(of([{ name: 'X-wing' }]));
    mockSwapiService.getVehicles.and.returnValue(of([{ name: 'Speeder' }]));

    fixture.detectChanges(); // ngOnInit is called
    tick(); // Resolve async operations

    expect(component.characters).toEqual(mockCharacters);
    expect(component.movieOptions).toContain('A New Hope');
    expect(component.speciesOptions).toContain('Human');
    expect(component.starshipOptions).toContain('X-wing');
    expect(component.vehicleOptions).toContain('Speeder');
  }));

  it('should apply filters correctly', fakeAsync(() => {
    const mockCharacters = [
      { name: 'Luke Skywalker', films: ['film-url'], species: ['species-url'], starships: ['starship-url'], vehicles: ['vehicle-url'] }
    ];

    mockSwapiService.getPeople.and.returnValue(of({ results: mockCharacters }));
    mockSwapiService.getMovies.and.returnValue(of([{ title: 'A New Hope' }]));
    mockSwapiService.getSpecies.and.returnValue(of({ name: 'Human' }));
    mockSwapiService.getStarships.and.returnValue(of([{ name: 'X-wing' }]));
    mockSwapiService.getVehicles.and.returnValue(of([{ name: 'Speeder' }]));

    fixture.detectChanges(); // ngOnInit is called
    tick(); // Resolve async operations

    component.movieFilter = 'A New Hope';
    component.applyFilter();
    tick(); // Resolve async filtering

    expect(component.filteredCharacters.length).toBe(1);
    expect(component.filteredCharacters[0].name).toBe('Luke Skywalker');
  }));

  it('should handle pagination correctly', () => {
    component.filteredCharacters = new Array(10).fill({ name: 'Character' });
    component.itemsPerPage = 5;
    component.currentPage = 1;

    expect(component.paginatedCharacters.length).toBe(5);

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should display "No data found" when there are no characters after filtering', fakeAsync(() => {
    const mockCharacters = [{ name: 'Luke Skywalker', films: ['film-url'], species: ['species-url'], starships: ['starship-url'], vehicles: ['vehicle-url'] }];

    // Mock the initial character load
    mockSwapiService.getPeople.and.returnValue(of({ results: mockCharacters }));
    mockSwapiService.getMovies.and.returnValue(of([{ title: 'A New Hope' }]));
    mockSwapiService.getSpecies.and.returnValue(of({ name: 'Human' }));
    mockSwapiService.getStarships.and.returnValue(of([{ name: 'X-wing' }]));
    mockSwapiService.getVehicles.and.returnValue(of([{ name: 'Speeder' }]));

    fixture.detectChanges(); // ngOnInit is called
    tick(); // Resolve async operations

    component.movieFilter = 'Non-existent Movie';
    component.applyFilter();
    tick(); // Resolve async filtering

    expect(component.noDataFound).toBeTrue();
    expect(component.filteredCharacters.length).toBe(0);
  }));

  it('should toggle the navbar active class', () => {
    const navbarLinks = document.createElement('div');
    navbarLinks.classList.add('navbar-links');
    document.body.appendChild(navbarLinks);

    component.toggleNavbar();
    expect(navbarLinks.classList.contains('active')).toBeTrue();

    component.toggleNavbar();
    expect(navbarLinks.classList.contains('active')).toBeFalse();

    document.body.removeChild(navbarLinks);
  });

  it('should navigate to character details when a character is clicked', () => {
    const mockCharacter = { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' };
    component.viewDetails(mockCharacter);

    expect(router.navigate).toHaveBeenCalledWith(['/characters', '1']);
  });
});
