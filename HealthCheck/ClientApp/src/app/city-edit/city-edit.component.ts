
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators,AbstractControl,AsyncValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseFormComponent } from '../Base.Form.Component';
import { City } from '../cities/City';
import { Country } from '../country/Country';
import { CityService } from '../cities/city.service';
import { ApiResult } from '../baseservice';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {

  title: string;

  form: FormGroup;

  city: City;

  id?: number;

  countries: Country[];

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('',Validators.required),
      lat: new FormControl('', [Validators.required,Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)]),
      lon: new FormControl('',[Validators.required, Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)]),
      countryId: new FormControl('', Validators.required)
    },null,this.isDupeCity());
    this.loadData();

  }

  loadData() {

    this.loadCountries();

    this.id = +this.acitvatedRoute.snapshot.paramMap.get('id');
    //edit
    if (this.id) {
      
      this.cityService.get<City>(this.id).subscribe(result => {
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
   
    this.cityService.getCountries<ApiResult<Country>>(0, 9999, "Name", null, null, null)
      .subscribe(result => {
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
   
      this.cityService.put<City>(city).subscribe(result => {
        console.log("City " + city.id + " has been updated.");

        this.router.navigate(['/app-cities']);
      }, error => console.error(error));
    }
    else {
     
      this.cityService.post<City>(city).subscribe(result => {
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

     
      return this.cityService.isDupeCity(city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }));

    }
  }


}
