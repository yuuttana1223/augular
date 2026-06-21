import { Component, input } from "@angular/core";
import { HousingLocationInfo } from "src/app/housinglocation";

@Component({
  selector: "app-housing-location",
  imports: [],
  template: ` <p>housing-location works!</p> `,
  styleUrls: ["./housing-location.css"],
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}
