import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';
import '@ui5/webcomponents-base/dist/features/PropertiesFormatSupport.js';
import {
  registerI18nBundle,
  fetchI18nBundle,
  getI18nBundle,
} from '@ui5/webcomponents-base/dist/i18nBundle.js';
import { LoaderService } from 'src/app/services/loader.service';
import { ApexChart } from 'ng-apexcharts';
// import '@ui5/webcomponents-base/dist/features/PropertiesFormatSupport.js';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('fcl') flexColumnLayout: any;
  sideNavigation: any;
  collapsed = false;
  popover: any;
  isDarkTheme: boolean;
  @ViewChild('popover') profilePopover: any;
  @ViewChild('settingsDialog') settingsDialog: any;
  @ViewChild('darkThemeChecked') darkThemeChecked: any;
  apexChart: ApexChart;
  constructor(public router: Router, public loaderService: LoaderService) {}

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
  async ngOnInit(): Promise<void> {
    setTheme('sap_fiori_3_dark');
    // registerI18nBundle('myApp', {
    //   en: '../../assets/i18n/messagebundle_en.properties',
    // });
    // await fetchI18nBundle('myApp');
    // const bundle = getI18nBundle('myApp');

    // const pleaseWait = bundle.getText('PLEASE_WAIT');
    console.log(this.apexChart, this.darkThemeChecked);
  }
  sideNaveToggle(): void {
    this.sideNavigation = document.querySelector('ui5-side-navigation');
    this.sideNavigation.collapsed = !this.sideNavigation.collapsed;
  }
  openProfilePopover($event: any): void {
    this.profilePopover.nativeElement.openBy($event.detail.targetRef);
  }
  sideNavigationChange($event: any): void {
    this.router.navigate([$event.detail.item.text]);
  }
  changeTheme(theme: string): void {
    setTheme(theme);
  }
  openSettings(): void {
    this.settingsDialog.nativeElement.open();
  }
  closeSettings(): void {
    this.settingsDialog.nativeElement.close();
  }
  saveSettings(): void {
    this.isDarkTheme = this.darkThemeChecked.nativeElement.checked;
    if (this.isDarkTheme) {
      setTheme('sap_fiori_3_dark');
    } else {
      setTheme('sap_belize_plus');
    }
    // this.settingsDialog.nativeElement.close();
  }
}
