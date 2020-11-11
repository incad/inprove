import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { FlotComponent } from 'src/app/components/flot/flot.component';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AppState } from 'src/app/app.state';


@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit {

  @ViewChild('chart') chart: FlotComponent;
  @Input() height: string;
  @Input() width: string;
  @Input() showTotal: boolean;


  @Output() selChanged: EventEmitter<any> = new EventEmitter();


  public data: any = {};
  public options = {
    series: {
      bars: {
        show: true,
        lineWidth: 1,
        barWidth: 10,
        order: 2
      },
      hoverable: true
    },
    grid: {
      hoverable: true,
      borderWidth: 0,
      color: '#546e7a',
      clickable: true,
      mouseActiveRadius: 1000

    },
    selection: {
      mode: 'x'
    },
    tooltip: {
      show: true,                 // false
      content(label, xval, yval, flotItem) { return xval + ' - ' + (+xval + 9) + ' (' + yval + ')'; }      // "%s | X: %x | Y: %y"
    },
    colors: ['#ffab40', '#ffab40', '#ffab40']
  };

  ranges = [0, 0];

  constructor(private service: AppService, private state: AppState) {
  }

  ngAfterViewInit() {
    this.state.stateChanged.subscribe(
      (resp) => {
        this.setData();
      }
    );
  }

  ngOnInit() {
    // this.state.searchSubject.subscribe(
    //   (resp) => {
    //     if (resp.type === 'home' || resp.type === 'results') {

    //       if (resp.state === 'start') {
    //         this.data = [{ data: [] }];
    //         this.chart.setData(this.data);
    //       } else {
    //         this.setData();
    //       }
    //     }
    //   }

    // this.subscriptions.push(this.state.chartBarToggled.subscribe(
    //   (resp) => {
    //     setTimeout(() => {
    //       this.chart.setOptions(this.options);
    //       this.setData();
    //     }, 500);
    //   }
    // ));
  }


  setData() {
    const field = this.state.source === 'rdcz' ? 'rokvyd' : 'rokvydani';
    if (this.state.facet_ranges && this.state.facet_ranges[field]) {
      let c: any[] = this.state.facet_ranges[field].counts;
      c = c.filter(val => {
        return val.name !== '0';
      });

      if (c.length > 0) {

        this.data = [{ data: this.mapBySource(c) }];
        this.ranges = [
          Math.max(+c[0].name, this.state.currentOd),
          Math.min(this.state.currentDo, +c[c.length - 1].name + 10)
        ];
        //                this.ranges = [c[0][0], +c[c.length-1][0]+10];
        this.chart.setData(this.data);
        this.chart.setSelection({ xaxis: { from: this.ranges[0], to: this.ranges[1] } });
      }

    } else {
      this.data = [{ data: [] }];
      this.chart.setData(this.data);
    }
  }

  mapBySource(c: any[]) {
    const mapped = [];
    if (this.state.source === 'vdk') {
      c.forEach(f => {
        mapped.push([f.name, f.value]);
      });
    } else if (this.state.source === 'czbrd') {
      for (let i =0; i < c.length; i++) {
        mapped.push([c[i], c[++i]]);
      }
    } else if (this.state.source === 'rdcz') {
      return Object.assign([], c);
    } 
    return mapped;
  }

  onSelection(ranges) {
    //    this.state.addRokFilter(Math.floor(ranges['xaxis']['from']), Math.ceil(ranges['xaxis']['to']));
    //    this.service.goToResults();
    this.ranges = [Math.floor(ranges.xaxis.from), Math.ceil(ranges.xaxis.to)];
  }

  use() {
    // this.state.addRokFilter(this.ranges[0], this.ranges[1]);
    // this.service.goToResults();
  }

  onClick(item) {
    // console.log('Rok: ' + item['datapoint'][0]);
    // this.state.addRokFilter(item.datapoint[0], item.datapoint[0] + 10);
    // this.service.goToResults();
  }


  clear() {
    // this.state.removeRokFilter();
    // this.service.goToResults();
  }


}
