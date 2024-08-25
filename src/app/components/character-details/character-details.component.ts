import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CharacterDetailsComponent implements OnInit {
 
  species!: string;
 

  character: any = null;
  movies: string[] = [];
  starships: string[] = [];
vehicles: string[] = [];

isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private swapservice:SwapiService){}





  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.swapservice.getPerson(id).subscribe(character => {
      this.character = character;
      this.loadAdditionalDetails();
    });
  }
  


  loadAdditionalDetails(): void {
    this.swapservice.getSpecies(this.character.species[0]).subscribe((species: any) => {
      this.species = species.name;
    });

    this.swapservice.getMovies(this.character.films).subscribe((movies: any[]) => {
      this.movies = movies.map(movie => movie.title);
    });

    this.swapservice.getStarships(this.character.starships).subscribe((starships: any[]) => {
      this.starships = starships.map(starship => starship.name);
    });

  


this.swapservice.getVehicles(this.character.vehicles).subscribe((vehicles: any[]) => {
  this.vehicles = vehicles.map(vehicle => vehicle.name);
  this.isLoading = false; // Stop loading once all data is fetched

});
    
    console.log(this.vehicles);
  }

  toggleNavbar() {
    const navbarLinks = document.querySelector('.navbar-links');
    navbarLinks?.classList.toggle('active');
  }

}
