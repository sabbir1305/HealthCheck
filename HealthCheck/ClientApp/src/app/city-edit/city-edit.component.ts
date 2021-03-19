
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators,AbstractControl,AsyncValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from '../cities/City';
import { Country } from '../country/Country';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent implements OnInit {

  title: string;

  form: FormGroup;

  city: City;

  id?: number;

  countries: Country[];

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrls:string
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('',Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required)
    },null,this.isDupeCity());
    this.loadData();

  }

  loadData() {

    this.loadCountries();

    this.id = +this.acitvatedRoute.snapshot.paramMap.get('id');
    //edit
    if (this.id) {
      let url = this.baseUrls + "api/Cities/" + this.id;
      this.http.get<City>(url).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;

        this.form.patchValue(this.city);
      }, error => console.error(error));
    }
    //create
    else {
      this.title = "Create a new City";
    }

  
  }

  loadCountries() {
    let url = this.baseUrls + 'api/Countries';
    //to do use a service to code reuse
    var params = new HttpParams().set("pageIndex", "0").set("pageSize", "9999").set("sortColumn", "name");

    this.http.get<any>(url, { params }).subscribe(result => {
      this.countries = result.data;
    }, error => console.error(error));
  }

  onSubmit() {
    var city = (this.id) ? this.city : <City>{};

    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get("countryId").value;

    if (this.id) {
      let url = this.baseUrls + "api/Cities/" + this.city.id;
      this.http.put<City>(url, city).subscribe(result => {
        console.log("City " + city.id + " has been updated.");

        this.router.navigate(['/app-cities']);
      }, error => console.error(error));
    }
    else {
      let url = this.baseUrls + "api/Cities/";
      this.http.post<City>(url, city).subscribe(result => {
        console.log("City " + result.id + " has been created.");

        this.router.navigate(['/app-cities']);
      },error=>console.error(error));
    }

   
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [Key: string]: any } | null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.get("name").value;
      city.lat = +this.form.get("lat").value;
      city.lon = +this.form.get("lon").value;
      city.countryId = +this.form.get("countryId").value;

      let url = this.baseUrls + "api/Cities/IsDupeCity";
      return this.http.post<boolean>(url, city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }));

    }
  }
}
