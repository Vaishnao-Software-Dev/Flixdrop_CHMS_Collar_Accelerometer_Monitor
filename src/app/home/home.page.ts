import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { LocalService } from "../services/localService";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {

  @ViewChild("myChart") myChart!: ElementRef;
  public chart: any;
  data: any = [];
  date: Date = new Date();
  private subscription: any;
  private maxDataPoints = 50;

  constructor(private localService: LocalService) {}

  ngOnInit(): void {
    this.plotLineChart();
    this.subscribeToAccelerometerData();
  }

  subscribeToAccelerometerData() {
    this.subscription = this.localService.accelerometerData.subscribe(
      (data: string) => {
        console.log('Incoming Data : ', data);

        const valuesArray = data.split(",");
        const currentDate = new Date();
        currentDate.setMilliseconds(currentDate.getMilliseconds() + 150);

        const object = {
          time: currentDate,
          coords: {
            x: parseFloat(valuesArray[0]),
            y: parseFloat(valuesArray[1]),
            z: parseFloat(valuesArray[2]),
          },
        };

        this.updateChartData(object);
      }
    );
  }

  updateChartData(newData: any) {
    this.chart.data.datasets[0].data.push(newData);
    this.chart.data.datasets[1].data.push(newData);
    this.chart.data.datasets[2].data.push(newData);

    if (this.chart.data.datasets[0].data.length > this.maxDataPoints) {
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
      this.chart.data.datasets[2].data.shift();
    }

    this.chart.update();
  }

  plotLineChart = async () => {
    this.chart = new Chart("MyChart", {
      type: "line",
      data: {
        datasets: [
          {
            tension: 0.3,
            label: "X",
            data: this.data,
            parsing: {
              xAxisKey: "time",
              yAxisKey: "coords.x",
            },
          },
          {
            tension: 0.3,
            label: "Y",
            data: this.data,
            parsing: {
              xAxisKey: "time",
              yAxisKey: "coords.y",
            },
          },
          {
            tension: 0.3,
            label: "Z",
            data: this.data,
            parsing: {
              xAxisKey: "time",
              yAxisKey: "coords.z",
            },
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 4,
        scales: {
          x: {
            type: "time",
            min: "00:00:00",
            max: "24:00:00",
            time: {
              unit: "second",
            },
            ticks: {
              stepSize: 10,
            },
            border: {
              display: false
             },
             grid: {
              display: false
             }
          },
          y: {
            beginAtZero: true,
            type: "linear",
            ticks: {
              stepSize: 1,
            },
            border: {
              display: false
             },
          },
        },
        animation: {
          duration: 0,
        }, 
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend:{
            display: true,
            position	:'top',
            align: 'end',
            labels:{
              padding: 25,
              textAlign: 'right',
              font:{
                size: 10,
                weight: 'bold'
              },
              usePointStyle: true,
              pointStyle: 'circle',
            },
            reverse: true,
          },
          title: {
            display: true,
            text: 'Flixdrop CHMS Collar Behaviourals',
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            usePointStyle: true,
            external: this.externalTooltipHandler,
          },
        },
      },
    });
  };

  getOrCreateTooltip = (chart: {
    canvas: {
      parentNode: {
        querySelector: (arg0: string) => any;
        appendChild: (arg0: any) => void;
      };
    };
  }) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.width = '250px';
      tooltipEl.style.background = 'rgb(255,255,255)';
      tooltipEl.style.borderRadius = '7px';
      tooltipEl.style.color = 'rgb(25,25,25)';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';

      const table = document.createElement('table');

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  externalTooltipHandler = (context: any) => {
    const { chart, tooltip } = context;
    const tooltipEl = this.getOrCreateTooltip(chart);
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    if (tooltip.body) {
      const titleLines = tooltip.title || [];

      const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);

      const tableHead = document.createElement('div');
      tableHead.style.width = '250px';
      tableHead.style.padding = '1rem';
      tableHead.style.background = 'rgb(25,25,25)';
      tableHead.style.color = 'gainsboro';
      tableHead.style.fontWeight = 'bold';
      tableHead.style.borderRadius = '7px 7px 0px 0px';
      tableHead.style.display = 'grid';
      tableHead.style.gridTemplateColumns = 'auto auto';
      tableHead.style.gridTemplateRows = 'auto';
      tableHead.style.gap = '1rem';

      titleLines.forEach((title: string) => {
        const customTitle: string = title;
        let titleArray = customTitle.split(',');

        const div_1 = document.createElement('div');
        div_1.style.display = 'flex';
        div_1.style.alignItems = 'center';
        div_1.style.justifyContent = 'flex-start';
        const text_1 = document.createTextNode(`${titleArray[0]},  ${titleArray[1]}`);

        const div_2 = document.createElement('div');
        div_2.style.display = 'flex';
        div_2.style.alignItems = 'center';
        div_2.style.justifyContent = 'flex-end';
        const text_2 = document.createTextNode(titleArray[2]);

        div_1.appendChild(text_1);
        div_2.appendChild(text_2);

        tableHead.appendChild(div_1);
        tableHead.appendChild(div_2);
      });

      const tableBody = document.createElement('tbody');
      tableBody.style.boxShadow =
        'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px';

      bodyLines.forEach((body: string, i: string | number) => {
        const colors = tooltip.labelColors[i];

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderBottom = '2px solid rgba(0,0,0, 0.025)';

        const td = document.createElement('td');
        td.style.padding = '1rem';
        td.style.margin = '0 1rem';
        td.style.display = 'grid';
        td.style.gridTemplateColumns = 'auto 1fr auto auto';
        td.style.gridTemplateRows = 'auto';
        td.style.gap = '1rem';
        td.style.inset = '1rem';
        td.style.borderBottom = '1px solid rgba(0,0,0,0.1)';

        const div_1 = document.createElement('div');
        div_1.style.display = 'flex';
        div_1.style.alignItems = 'center';
        div_1.style.justifyContent = 'center';
        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.borderRadius = '50%';
        span.style.display = 'inline-block';

        const customBody: string = body[0];
        let textArray = customBody.split(':');

        const div_2 = document.createElement('div');
        div_2.style.display = 'flex';
        div_2.style.alignItems = 'center';
        div_2.style.justifyContent = 'flex-start';
        div_2.style.fontSize = '0.8rem';
        const text1 = document.createTextNode(textArray[0]);

        const div_3 = document.createElement('div');
        div_3.style.display = 'flex';
        div_3.style.alignItems = 'center';
        div_3.style.justifyContent = 'flex-end';
        div_3.style.fontSize = '0.8rem';
        const text2 = document.createTextNode(textArray[1]);

        const div_4 = document.createElement('div');

        div_1.appendChild(span);
        div_2.appendChild(text1);
        div_3.appendChild(text2);

        td.appendChild(div_1);
        td.appendChild(div_2);
        td.appendChild(div_3);
        td.appendChild(div_4);

        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector('table');

      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + 'px' + tooltip.options.padding + 'px';
  };
  
}
