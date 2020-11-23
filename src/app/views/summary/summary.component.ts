import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTheme,
  ApexTooltip,
  ApexNoData,
} from 'ng-apexcharts';

export type ChartOptions = {
  theme: ApexTheme;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  noData: ApexNoData;
};

export interface KPIInterface {
  icon: string;
  title: string;
  value: number;
  color: string;
  isNumber: boolean;
  tooltip: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, AfterViewInit {
  @Input() theme: string;
  @ViewChild('selectCountry') selectCountry: any;
  // filter properties
  minDate = '1/1/2020'; // dayjs('2020-01-01').format('DD-MM-YYYY');
  maxDate = dayjs.utc().format('MM/DD/YYYY');

  // properties for KPI cards
  public oKPIData: KPIInterface[] = [];
  public sThreshold = 50;
  public countries = [];
  public selectedCountry = 'india';
  public selectedMinDate = dayjs()
    .subtract(30, 'day')
    .utc()
    .format('YYYY-MM-DD');
  public selectedMaxDate = dayjs.utc().format('YYYY-MM-DD');
  public selectedDateRange =
    dayjs(this.selectedMinDate).format('MM/DD/YYYY') +
    ' - ' +
    dayjs(this.selectedMaxDate).format('MM/DD/YYYY');

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(public httpService: HttpService) {
    this.chartOptions = {
      series: [],
      chart: {
        background: '#29313A',
        events: {
          dataPointSelection: (event, chartContext, config): void => {
            console.log(event, chartContext, config);
            console.log(config.w.config.series[config.seriesIndex].name);
            console.log(
              config.w.config.series[config.seriesIndex].data[
                config.dataPointIndex
              ]
            );
          },
        },
        width: '99%',
        height: 400,
        type: 'area',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: true,
        },
      },
      // colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: '',
        align: 'left',
        floating: true,
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          // colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        type: 'datetime',
        // categories: [],
        // title: {
        //   text: 'Days',
        //   offsetY: 11,
        //   offsetX: 0,
        // },
        labels: {
          format: 'MMM dd, yyyy',
        },
      },
      yaxis: {
        // title: {
        //   text: 'Counts',
        // },
      },
      tooltip: { x: { format: 'DD/MM/YYY' } },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        floating: true,
        offsetY: 35,
        offsetX: 0,
      },
      theme: {
        mode: 'dark',
        palette: 'palette6',
        monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'dark',
          shadeIntensity: 0.65,
        },
      },
      noData: {
        text: 'No Data Available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined,
        },
      },
    };
  }

  ngOnInit(): void {
    console.log(this.chart, window, this.selectCountry);
    this.getDataBySelectedCountry(
      this.selectedCountry,
      this.selectedMinDate,
      this.selectedMaxDate
    );
    this.httpService.getAllCountries().subscribe({
      next: (data: any) => {
        data.sort(this.dynamicSort('Country'));
        this.countries = data;
        this.countries.unshift({ Country: 'India', Slug: 'india', ISO2: 'IN' });
      },
    });
  }
  ngAfterViewInit(): void {
    console.log(
      'on after view init',
      this.selectCountry.nativeElement.selected
    );
    // this returns null
    this.selectCountry.nativeElement.value === 'india'
      ? (this.selectCountry.nativeElement.selected = true)
      : (this.selectCountry.nativeElement.selected = false);
  }

  public changeCountry($event: any): void {
    this.selectedCountry = $event.detail.selectedOption.value;
    this.getDataBySelectedCountry(
      this.selectedCountry,
      this.selectedMinDate,
      this.selectedMaxDate
    );
  }

  changeDateRange($event: any): void {
    this.selectedMinDate = dayjs($event.detail.value.split(' - ')[0]).format(
      'YYYY-MM-DD'
    );
    this.selectedMaxDate = dayjs($event.detail.value.split(' - ')[1]).format(
      'YYYY-MM-DD'
    );
    this.getDataBySelectedCountry(
      this.selectedCountry,
      this.selectedMinDate,
      this.selectedMaxDate
    );
  }

  // Function to sort alphabetically an array of objects by some specific key.
  //  @param {String} property Key of the object to sort.
  public dynamicSort(property: any): any {
    let sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a: any, b: any) => {
      if (sortOrder === -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    };
  }

  public getDataBySelectedCountry(
    country: string,
    from: string,
    to: string
  ): void {
    this.httpService.getDataBySelectedCountry(country, from, to).subscribe({
      next: (data: any) => {
        const temp = _(data)
          .groupBy('Date')
          .map((val: any, i: any) => ({
            Date: i,
            Active: _.sumBy(val, 'Active'),
            Confirmed: _.sumBy(val, 'Confirmed'),
            Deaths: _.sumBy(val, 'Deaths'),
            Recovered: _.sumBy(val, 'Recovered'),
            CountryCode: val[0].CountryCode,
          }))
          .value();
        if (temp.length > 1) {
          const firstEl = temp[0];
          const lastEl = temp[temp.length - 1];
          const activeCasesInSelectedRangeForACountry = Math.abs(
            firstEl.Active - lastEl.Active
          );
          const confirmedCasesInSelectedRangeForACountry =
            lastEl.Confirmed - firstEl.Confirmed;
          const deathCasesInSelectedRangeForACountry =
            lastEl.Deaths - firstEl.Deaths;
          const recoveredCasesInSelectedRangeForACountry =
            lastEl.Recovered - firstEl.Recovered;
          // console.log(temp, firstEl, lastEl);
          // console.log(
          //   activeCasesInSelectedRangeForACountry,
          //   confirmedCasesInSelectedRangeForACountry,
          //   deathCasesInSelectedRangeForACountry,
          //   recoveredCasesInSelectedRangeForACountry
          // );
          this.oKPIData = [];
          this.oKPIData.push(
            {
              icon: 'wounds-doc',
              title: 'Total Active',
              value: activeCasesInSelectedRangeForACountry,
              color:
                activeCasesInSelectedRangeForACountry < this.sThreshold
                  ? '#f44336'
                  : '#039be5',
              isNumber: true,
              tooltip: `Theshold value is ${this.sThreshold}`,
            },
            {
              icon: 'sys-enter',
              title: 'Total Confirmed',
              value: confirmedCasesInSelectedRangeForACountry,
              color:
                confirmedCasesInSelectedRangeForACountry > this.sThreshold
                  ? '#f44336'
                  : '#039be5',
              isNumber: true,
              tooltip: `Theshold value is ${this.sThreshold}`,
            },
            {
              icon: 'cancel',
              title: 'Total Deaths',
              value: deathCasesInSelectedRangeForACountry,
              color:
                deathCasesInSelectedRangeForACountry > this.sThreshold
                  ? '#f44336'
                  : '#039be5',
              isNumber: true,
              tooltip: `Theshold value is ${this.sThreshold}`,
            },
            {
              icon: 'nutrition-activity',
              title: 'Total Recovered',
              value: recoveredCasesInSelectedRangeForACountry,
              color:
                recoveredCasesInSelectedRangeForACountry < this.sThreshold
                  ? '#f44336'
                  : '#039be5',
              isNumber: true,
              tooltip: `Theshold value is ${this.sThreshold}`,
            }
          );
          const series = [
            {
              name: 'Active',
              data: [],
            },
            {
              name: 'Confirmed',
              data: [],
            },
            {
              name: 'Deaths',
              data: [],
            },
            {
              name: 'Recovered',
              data: [],
            },
          ];
          const chartData = this.getChartData(
            temp,
            this.chartOptions.xaxis.type,
            'Date',
            series
          );
          this.chartOptions.series = chartData.seriesData;
          console.log(this.chartOptions.series);
          this.chartOptions.xaxis.categories = chartData.xCategory;
        } else {
          this.oKPIData = [];
          this.chartOptions.series = [{ name: 'No Data', data: [] }];
          // this.chartOptions.xaxis.categories = [];
        }
      },
    });
  }

  getChartData(data: any, type: string, xaxis: string, series: any): any {
    if (type === 'category') {
      const xCategory = [];
      data.forEach((elem) => {
        xCategory.push(elem[xaxis]);
        series.forEach((s, i) => {
          series[i].data.push(elem[series[i].name]);
        });
      });
      return {
        xCategory,
        seriesData: series,
      };
    } else if (type === 'datetime') {
      const xCategory = [];
      data.forEach((elem) => {
        xCategory.push(elem[xaxis]);
        series.forEach((s, i) => {
          series[i].data.push({ x: elem[xaxis], y: elem[series[i].name] });
        });
      });
      return {
        seriesData: series,
      };
    }
  }
}
