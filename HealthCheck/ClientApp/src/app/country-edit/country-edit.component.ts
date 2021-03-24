import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn }
  from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Country } from '../country/Country';
import { BaseFormComponent } from '../Base.Form.Component';
import { CountryService } from '../country/countryservice';
@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {

  //the view title
  title: string;

  //the form model
  form: FormGroup;


  country: Country;

  id?: number;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService
   
  ) {
    super();
    this.loadData();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField("name")],
      iso2: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z]{2}$/)],

        this.isDupeField("iso2")],
      iso3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3}$/)], this.isDupeField("iso3")]
    });
    this.loadData();
  }

  loadData() {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {

      this.countryService.get<Country>(this.id).subscribe(result => {
        this.country = result;
        this.title = "Edit - " + this.country.name;

        this.form.patchValue(this.country);
      }, error => console.error(error));
    }
    else {
      this.title = "Create a new Country";
    }
  }

  onSubmit() {

    var country = (this.id) ? this.country : <Country>{};
    country.name = this.form.get("name").value;
    country.iso2 = this.form.get("iso2").value;
    country.iso3 = this.form.get("iso3").value;

    if (this.id) {

      this.countryService.put<Country>(country).subscribe(result => {
        this.router.navigate(['/app-country']);
      }, error => console.error(error));
    }
    else {
     
      this.countryService.post<Country>( country).subscribe(result => {
        this.router.navigate(['/app-country']);
      }, error => console.log(error));
    }
  }



  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [Key: string]: any } | null> => {
     

      var countryId = (this.id) ? this.id.toString() : "0";


      return this.countryService.isDupeField(countryId, fieldName, control.value)
        .pipe(map(result => {
        return (result ? { isDupeField: true } : null);
      }));
    }
  }



}
