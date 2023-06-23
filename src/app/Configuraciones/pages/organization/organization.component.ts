import { AfterViewInit, Component } from '@angular/core';
import OrgChart from "@balkangraph/orgchart.js";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements AfterViewInit {

  constructor() {

  }
  ngAfterViewInit(): void {
    const tree = document.getElementById('tree');
    if (tree) {
      var chart = new OrgChart(tree, {
        nodeBinding: {
          field_0: "name",
          img_0: "img"
        },
        tags: {
          "subLevels0": {
            subLevels: 0
          },
          "subLevels1": {
            subLevels: 1
          },
          "subLevels2": {
            subLevels: 2
          },
          "level3": {
            subLevels: 3
          }
        }
      });

      chart.load([
        { id: 1, name: "Alcalde municipal", title: "CEO" },
        { id: 2, pid: 1, name: "Cargo 1", tags: ["level3"] },
        { id: 3, pid: 1, name: "Cargo 2", },
        { id: 4, pid: 2, name: "Cargo 3", },
        { id: 5, pid: 2, name: "Cargo 4", },
        { id: 6, pid: 3, name: "Cargo 5", },
        { id: 7, pid: 3, name: "Cargo 6", }
      ]);
    }
  }

}
