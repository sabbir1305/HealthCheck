
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { City } from '../cities/City';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent implements OnInit {

  title: string;

  form: FormGroup;

  city: City;
  constructor(
    private acitvatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrls:string
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    });
    this.loadData();

  }

  loadData() {
    let id = this.acitvatedRoute.snapshot.paramMap.get('id');

    let url = this.baseUrls + "api/Cities/" + id;
    this.http.get<City>(url).subscribe(result => {
      this.city = result;
      this.title = "Edit - " + this.city.name;

      this.form.patchValue(this.city);
    }, error => console.error(error));
  }

  onSubmit() {
    var city = this.city;

    city.name = this.form.get("name").value;
    city.lat = this.form.get("lat").value;
    city.lon = this.form.get("lon").value;

    let url = this.baseUrls + "api/Cities/" + this.city.id;
    this.http.put<City>(url, city).subscribe(result => {
      console.log("City " + city.id + " has been updated.");

      this.router.navigate(['/app-cities']);
    }, error => console.error(error));
  }

}
