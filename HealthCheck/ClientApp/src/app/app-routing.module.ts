import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { HealthCheckComponent } from './health-check/health-check.component';
import { CitiesComponent } from './cities/cities.component';
import { CountryComponent } from "./country/country.component";
import { CityEditComponent } from "./city-edit/city-edit.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'health-check', component: HealthCheckComponent },
  { path: 'app-cities', component: CitiesComponent },
  { path: 'app-country', component: CountryComponent },
  {path: 'city/:id', component:CityEditComponent},
  {path: 'city', component:CityEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
