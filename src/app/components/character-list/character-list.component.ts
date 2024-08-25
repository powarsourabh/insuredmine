import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class CharacterListComponent implements OnInit {

  characters: any[] = []; 
  filteredCharacters: any[] = [];
  filter: any = {
    movie: '',
    species: '',
    starships: '',
    vehicles: '',
    birthYearRange: { start: null, end: null }
  };
  movies: string[] = [];  
  speciesList: string[] = [];  

  movieFilter: string = '';
  speciesFilter: string = '';
  vehicleFilter: string = '';
  starshipFilter: string = '';
  birthYearStart: number | null = null;
  birthYearEnd: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Dropdown data
  movieOptions: string[] = [];
  speciesOptions: string[] = [];
  vehicleOptions: string[] = [];
  starshipOptions: string[] = [];
starships: any;

isLoading: boolean = true;
noDataFound: boolean = false;

  constructor(private swapservice:SwapiService, private router:Router){}

  ngOnInit(): void {
    this.swapservice.getPeople().subscribe((response: any) => {
      this.characters = response.results;
      this.filteredCharacters = this.characters;
      // this.populateFilterData();
      this.populateFilterOptions();
      this.isLoading = false;
      this.noDataFound = this.characters.length === 0;

    },
    (error) => {
      console.error('Failed to fetch characters', error);
      this.isLoading = false;
      this.noDataFound = true;
    }
  );
  }



  populateFilterOptions(): void {
    // Populate movieOptions, speciesOptions, vehicleOptions, starshipOptions
    this.characters.forEach(character => {
      // Movies
      character.films.forEach((filmUrl: string) => {
        this.swapservice.getMovies([filmUrl]).subscribe((films: any[]) => {
          const filmTitle = films[0]?.title;
          if (filmTitle && !this.movieOptions.includes(filmTitle)) {
            this.movieOptions.push(filmTitle);
          }
        });
      });


      character.starships.forEach((starshipUrl: string) => {
        this.swapservice.getStarships([starshipUrl]).subscribe((starships: any[]) => {
          const starshipName = starships[0]?.name; // Corrected from title to name
          console.log('Starship Data Retrieved:', starships); // Log the entire starship object(s)
          console.log('Starship Name:', starshipName); // Log the starship name
      
          if (starshipName && !this.starshipOptions.includes(starshipName)) {
            this.starshipOptions.push(starshipName);
          }
        });
      });
      

this.characters.forEach(character => {
  if(character.vehicles.length > 0) {
    this.swapservice.getVehicles(character.vehicles).subscribe((vehicles: any[]) => {
      vehicles.forEach(vehicle => {
        const vehicleName = vehicle?.name;
        console.log('Vehicle Retrieved: ', vehicleName);
        if(vehicleName && !this.vehicleOptions.includes(vehicleName)){
          this.vehicleOptions.push(vehicleName);
        }
      });
    });
  }
});
     
      
      if (character.species.length > 0) {
        this.swapservice.getSpecies(character.species[0]).subscribe((species: any) => {
          const speciesName = species?.name;
          if (speciesName && !this.speciesOptions.includes(speciesName)) {
            this.speciesOptions.push(speciesName);
          }
        });
      }

    

     
    });
  }

  
  toggleNavbar() {
    const navbarLinks = document.querySelector('.navbar-links');
    navbarLinks?.classList.toggle('active');
  }

 


  applyFilter(): void {
    this.isLoading = true;

    console.log("Applying filters...");
  
    let filteredMovies = Promise.resolve(this.characters);
    let filteredSpecies = Promise.resolve(this.characters);
    let filteredStarships = Promise.resolve(this.characters);
    let filteredVehicles = Promise.resolve(this.characters);
  
    if (this.movieFilter) {
      console.log("Filtering by movie:", this.movieFilter);
      filteredMovies = Promise.all(this.characters.map(character =>
        this.filterByMovie(character)
      )).then(results => this.characters.filter((_, i) => results[i]));
    }
  
    if (this.speciesFilter) {
      console.log("Filtering by species:", this.speciesFilter);
      filteredSpecies = Promise.all(this.characters.map(character =>
        this.filterBySpecies(character)
      )).then(results => this.characters.filter((_, i) => results[i]));
    }
  
    if (this.starshipFilter) {
      console.log("Filtering by starship:", this.starshipFilter);
      filteredStarships = Promise.all(this.characters.map(character =>
        this.filterByStarship(character)
      )).then(results => this.characters.filter((_, i) => results[i]));
    }

  
  

    if (this.vehicleFilter) {
      console.log("Filtering by vehicle:", this.vehicleFilter);
      filteredVehicles = Promise.all(this.characters.map(character =>
        this.filterByVehicle(character)
      )).then(results => this.characters.filter((_, i) => results[i]));
    }


    Promise.all([filteredMovies, filteredSpecies, filteredStarships, filteredVehicles]).then(([movieResults, speciesResults, starshipResults, vehicleResults]) => {
      this.filteredCharacters = movieResults.filter(character => speciesResults.includes(character) && starshipResults.includes(character) && vehicleResults.includes(character));
      console.log("Filtered characters:", this.filteredCharacters);
      this.noDataFound = this.filteredCharacters.length === 0;
      this.isLoading = false;
      this.currentPage = 1; // Reset to first page after filtering
    });
  }
  
  filterByMovie(character: any): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.movieFilter) return resolve(true);
      if (!character.films || character.films.length === 0) return resolve(false);
      this.swapservice.getMovies(character.films).subscribe(films => {
        const match = films.some(film => film.title === this.movieFilter);
        console.log("Character:", character.name, "Movie match:", match);
        resolve(match);
      });
    });
  }
  
  filterBySpecies(character: any): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.speciesFilter) return resolve(true);
      if (!character.species || character.species.length === 0) return resolve(false);
      this.swapservice.getSpecies(character.species[0]).subscribe(species => {
        const match = species.name === this.speciesFilter;
        console.log("Character:", character.name, "Species match:", match);
        resolve(match);
      });
    });
  }
  
  filterByStarship(character: any): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.starshipFilter) return resolve(true);
      if (!character.starships || character.starships.length === 0) return resolve(false);
      this.swapservice.getStarships(character.starships).subscribe(starships => {
        const match = starships.some(starship => starship.name === this.starshipFilter);
        console.log("Character:", character.name, "Starship match:", match);
        resolve(match);
      });
    });
  }


  filterByVehicle(character: any): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.vehicleFilter) return resolve(true);
      if (!character.vehicles || character.vehicles.length === 0) return resolve(false);
  
      this.swapservice.getVehicles(character.vehicles).subscribe((vehicles: any[]) => {
        const matches = vehicles.some(vehicle => vehicle.name === this.vehicleFilter);
        console.log("Character:", character.name, "Vehicle match:", matches);
        resolve(matches);
      });
    });
  }
  
  

  goBack(): void {
    this.filteredCharacters = this.characters;
    this.noDataFound = false;
    this.router.navigate(['/characters']);
  }

  getNumericBirthYear(birthYear: string): number {
    // Convert birth year to numeric value (handle BBY/ABY)
    if (birthYear.includes('BBY')) {
      return -parseFloat(birthYear.replace('BBY', '').trim());
    } else if (birthYear.includes('ABY')) {
      return parseFloat(birthYear.replace('ABY', '').trim());
    }
    return 0; // Default case
  }

  viewDetails(character: any): void {
    const id = character.url.split('/').filter(Boolean).pop();
    this.router.navigate(['/characters', id]);
  }
  

  get totalPages(): number {
    return Math.ceil(this.filteredCharacters.length / this.itemsPerPage);
  }

  get paginatedCharacters(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCharacters.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Move to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  

}
