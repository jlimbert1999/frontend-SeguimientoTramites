import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';

@Component({
  selector: 'line',
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent implements OnInit {
  @Input()
  options: EChartsOption;
  constructor() {}

  ngOnInit(): void {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    this.options = {
      title: {
        text: 'World Population',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: ['Brazil', 'Indonesia', 'USA', 'India', ],
      },
      series: [
       
        {
          name: '2012',
          type: 'bar',
          data: [19325, 2000 ],
        },
       
      ],
    };
  }
  theme: string | ThemeOption = 'dark';
}
