import { AfterViewInit, Component, OnInit } from '@angular/core';
import OrgChart from "@balkangraph/orgchart.js";
import { CargoService } from '../../services/cargo.service';
import { orgChartData } from '../../interfaces/job.interface';


OrgChart.templates['ula'].size = [450, 150];
OrgChart.templates['ula']['field_0'] = '<text style="font-size: 18px;" x="120" y="40" class="field_0">{val}</text>';
OrgChart.templates['ula']['field_1'] = '<text style="font-size: 12px;" class="field_1" x="120" y="80">{val}</text>';
OrgChart.templates['ula'].node = '<rect filter="url(#cool-shadow)"  x="0" y="0" height="150" width="450" fill="#ffffff" stroke-width="1" stroke="#eeeeee" rx="10" ry="10"></rect>';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements AfterViewInit, OnInit {
  organizationData: orgChartData[] = []
  orgCharts: any[] = []
  constructor(private readonly cargoService: CargoService) {

  }
  ngOnInit(): void {
   
  }
  ngAfterViewInit(): void {
    this.cargoService.getOrganization().subscribe(data => {
      this.organizationData = data
      this.createCharts()
    })
  }
  createCharts() {
    this.organizationData.forEach((element, index) => {
      const tree = document.getElementById(`orgchart${index}`);
      if (tree) {
        var chart = new OrgChart(tree, {
          template: "ula",
          miniMap: true,
          nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img",
            size: 'small'
          },
        });
       
        chart.load(element.data)
      }
    })
  }
  

}
