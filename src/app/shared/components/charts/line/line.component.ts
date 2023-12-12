import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { ChartLineData } from 'src/app/reports/interfaces/chart-line.data.interface';

@Component({
  selector: 'line-chart',
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent implements OnInit {
  options: EChartsOption = {
    legend: {},
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    dataset: {
      // dimensions: ['product', '2015', '2016', '2017'],
      // source: [
      //   { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
      //   { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
      //   { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
      //   { product: 'Walnut Brownie', '2015': 72.4, '2017': 39.1 },
      // ],
    },
    xAxis: {},
    yAxis: { type: 'category' },
    series: [
      { type: 'bar', label: { show: true, position: 'right' } },
      { type: 'bar', label: { show: true, position: 'right' } },

    ],
  };
  @Input() set data(values: ChartLineData[]) {
    this.options = {
      ...this.options,
      dataset: {
        dimensions: Object.keys(values[0]),
        source: values,
      },
    };
  }
  constructor() {}

  ngOnInit(): void {}
  theme: string | ThemeOption;
}
