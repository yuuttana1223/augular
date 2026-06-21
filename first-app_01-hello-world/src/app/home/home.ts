import { Component, inject } from "@angular/core";
import { Housing } from "src/app/housing";
import { HousingLocation } from "src/app/housing-location/housing-location";
import type { HousingLocationInfo } from "src/app/housinglocation";

@Component({
  selector: "app-home",
  imports: [HousingLocation],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" />
        <button class="primary" type="button">Search</button>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of housingLocationList; track $index) {
        <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>
  `,
  styleUrls: ["./home.css"],
})
export class Home {
  housingLocationList: HousingLocationInfo[] = [];
  housingService = inject(Housing);
  constructor() {
    this.housingLocationList = this.housingService.getAllHousingLocations();
  }
}
