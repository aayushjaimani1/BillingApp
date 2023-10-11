import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit{
  chartOptions = {
    title: 'Monthly Sales Report',
    series: {
      0: {
        areaOpacity: 0,
        lineWidth: 2,
      }
    },
    legend: { position: 'bottom' },
    hAxis: {
      title: 'Days',
      format: 'yyyy-MM-dd'
    },
    vAxis: {
      title: 'Sales'
    }
  };
  chartWidth = 1200;
  chartHeight = 600;
  myData: any = [['2023-05-01',100]];
  myType = ChartType.AreaChart

  dailyData: any = [['00:00:00',10]];
  dailyDatachartOptions = {
    title: 'Daily Sales Report',
    series: {
      0: {
        areaOpacity: 0,
        lineWidth: 2,
      }
    },
    legend: { position: 'bottom' },
    hAxis: {
      title: 'Today',
      format: 'HH:mm:ss'
    },
    vAxis: {
      title: 'Sales'
    }
  };

  yearlyDatachartOptions = {
    title: 'Yearly Sales Report',
    series: {
      0: {
        areaOpacity: 0,
        lineWidth: 2,
      }
    },
    legend: { position: 'bottom' },
    hAxis: {
      title: 'Yearly',
      format: 'MMMM'
    },
    vAxis: {
      title: 'Sales'
    }
  };

  yearlyData: any = [['2023',10]];

  constructor(private db: DashboardService){

  }
  ngOnInit(): void {
    this.db.reportData().subscribe((response)=>{
      console.log(response);
      
      for(let i = 0; i < response.length; i++){
        
        const combinedData: Array<[string, number]> = response.reduce((acc: Array<[string, number]>, [date, value]: any) => {
          const existingEntry = acc.find(([existingDate]) => existingDate === date);
          if (existingEntry) {
            existingEntry[1] += value;
          } else {
            acc.push([date, value]);
          }
          return acc;
        }, []);
        combinedData.sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        this.myData = combinedData
      }
    })

    this.db.reportDailyData().subscribe((response)=>{
      for(let i = 0; i < response.length; i++){
        
        const combinedData: Array<[string, number]> = response.reduce((acc: Array<[string, number]>, [date, value]: any) => {
          const existingEntry = acc.find(([existingDate]) => existingDate === date);
          if (existingEntry) {
            existingEntry[1] += value;
          } else {
            acc.push([date, value]);
          }
          return acc;
        }, []);
        combinedData.sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        this.dailyData = combinedData
      }
    })

    this.db.reportYearlyData().subscribe((response)=>{
      for(let i = 0; i < response.length; i++){
        
        const combinedData: Array<[string, number]> = response.reduce((acc: Array<[string, number]>, [date, value]: any) => {
          const existingEntry = acc.find(([existingDate]) => existingDate === date);
          if (existingEntry) {
            existingEntry[1] += value;
          } else {
            acc.push([date, value]);
          }
          return acc;
        }, []);
        const monthNames = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ];
        combinedData.sort((a:any, b:any) => monthNames.indexOf(b) - monthNames.indexOf(a));
        this.yearlyData = combinedData
      }
    })
  }

  
  
}
