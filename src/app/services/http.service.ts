import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // Landingpage APIs
  private summaryApi = 'https://api.covid19api.com/summary';
  private lastSevenDaysByCountryApi =
    'https://api.covid19api.com/country/${country}/status/confirmed/live?from=${from}&to=${to}';
  private mcCntApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/landingpage/mc_cnt';
  private irRateApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/landingpage/ir_rate';
  private missReadTrendApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/landingpage/mis_reads_trend';
  private missReadAgingApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/landingpage/miss_reads_aging';
  private missedReadApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/landingpage/miss_reads_detail';

  // MD Recon APIs
  private mdrSummaryApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/mdr/summary';
  private mdrDetailApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/mdr/detail';
  private mdrDetailCountsApi =
    'https://smartmeteranalytics-prod.uc.r.appspot.com/apis/mdr/detail-cnts';

  constructor(private httpClient: HttpClient) {}

  getMissedReadData(): any {
    return this.httpClient
      .get(this.missedReadApi)
      .pipe(catchError(this.handleError));
  }

  getMeterCount(): any {
    return this.httpClient
      .get(this.mcCntApi)
      .pipe(catchError(this.handleError));
  }

  getIRRate(): any {
    return this.httpClient
      .get(this.irRateApi)
      .pipe(catchError(this.handleError));
  }

  getMissReadTrendData(): any {
    return this.httpClient
      .get(this.missReadTrendApi)
      .pipe(catchError(this.handleError));
  }

  getMissReadAgingData(): any {
    return this.httpClient
      .get(this.missReadAgingApi)
      .pipe(catchError(this.handleError));
  }

  getMDRSummaryData(): any {
    return this.httpClient
      .get(this.mdrSummaryApi)
      .pipe(catchError(this.handleError));
  }

  getMDRDetailData(): any {
    return this.httpClient
      .get(this.mdrDetailApi)
      .pipe(catchError(this.handleError));
  }

  getMDRDetailCountData(): any {
    return this.httpClient
      .get(this.mdrDetailCountsApi)
      .pipe(catchError(this.handleError));
  }

  getCovidSummaryData(): any {
    return this.httpClient
      .get(this.summaryApi)
      .pipe(catchError(this.handleError));
  }

  getDataBySelectedCountry(country: string, from: string, to: string): any {
    this.lastSevenDaysByCountryApi = `https://api.covid19api.com/country/${country}?from=${from}&to=${to}`;
    return this.httpClient
      .get(this.lastSevenDaysByCountryApi)
      .pipe(catchError(this.handleError));
  }

  getAllCountries(): any {
    return this.httpClient
      .get('https://api.covid19api.com/countries')
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): any {
    return throwError(`An error occurred: ${err.status}: ${err.message}`);
  }
}
