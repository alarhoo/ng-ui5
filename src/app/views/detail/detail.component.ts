import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTheme,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
};

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @ViewChild('fcl') flexColumnLayout: any;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        background: '#29313A',
        width: '99%',
        type: 'pie',
        events: {
          dataPointSelection: (event, chartContext, config): void => {
            this.openMidColumn();
            // console.log(event, chartContext, config);
            console.log(config, config.dataPointIndex, config.seriesIndex, config.w.config.series[config.seriesIndex].name);
            // console.log(
            //   config.w.config.series[config.seriesIndex].data[
            //     config.dataPointIndex
            //   ]
            // );
          },
        },
      },
      theme: {
        mode: 'dark',
        palette: 'palette11'
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {}

  openMidColumn(): void {
    this.flexColumnLayout.nativeElement.layout = 'TwoColumnsMidExpanded';
    console.log(this.flexColumnLayout);
  }
  closeMidColumn(): void {
    this.flexColumnLayout.nativeElement.layout = 'OneColumn';
  }
  openFullMidColumn(): void {
    this.flexColumnLayout.nativeElement.layout = 'MidColumnFullscreen';
  }
  openEndColumn(): void {
    this.flexColumnLayout.nativeElement.layout = 'ThreeColumnsEndExpanded';
  }
}
