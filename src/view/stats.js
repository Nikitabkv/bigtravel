import AbstractComponent from './abstract.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {getDuration} from '../util/util.js';

const BAR_HEIGHT = 55;

const createStatsTemplate = () =>
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`;

export default class StatsView extends AbstractComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel= pointsModel;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _getPointData(SpendOrLabelsBySpendOrCountOrLabelsByCountOrTimeOrLabelsByTime) {
    const points = this._pointsModel.getPoint().slice();
    const busMoney = {
      count: 0,
      price: 0,
      title: 'BUS',
      time: 0,
    };
    const taxiMoney = {
      count: 0,
      price: 0,
      title: 'TAXI',
      time: 0,
    };
    const trainMoney = {
      count: 0,
      price: 0,
      title: 'TRAIN',
      time: 0,
    };
    const shipMoney = {
      count: 0,
      price: 0,
      title: 'SHIP',
      time: 0,
    };
    const transportMoney = {
      count: 0,
      price: 0,
      title: 'TRANSPORT',
      time: 0,
    };
    const driveMoney = {
      count: 0,
      price: 0,
      title: 'DRIVE',
      time: 0,
    };
    const flightMoney = {
      count: 0,
      price: 0,
      title: 'FLIGHT',
      time: 0,
    };
    const restaurantMoney = {
      count: 0,
      price: 0,
      title: 'RESTAURANT',
      time: 0,
    };
    const sightseeingMoney = {
      count: 0,
      price: 0,
      title: 'SIGHTSEEING',
      time: 0,
    };
    const Checkin = {
      count: 0,
      price: 0,
      title: 'CHEK-IN',
      time: 0,
    };

    points.forEach((elem) => {
      switch (elem.eventType) {
        case 'bus':
          busMoney.price += +elem.eventCost;
          busMoney.count += 1;
          busMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'taxi':
          taxiMoney.price += +elem.eventCost;
          taxiMoney.count += 1;
          taxiMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'train':
          trainMoney.price += +elem.eventCost;
          trainMoney.count += 1;
          trainMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'ship':
          shipMoney.price += +elem.eventCost;
          shipMoney.count += 1;
          shipMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'transport':
          transportMoney.price += +elem.eventCost;
          transportMoney.count += 1;
          transportMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'drive':
          driveMoney.price += +elem.eventCost;
          driveMoney.count += 1;
          driveMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'flight':
          flightMoney.price += +elem.eventCost;
          flightMoney.count += 1;
          flightMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'restaurant':
          restaurantMoney.price += +elem.eventCost;
          restaurantMoney.count += 1;
          restaurantMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'sightseeing':
          sightseeingMoney.price += +elem.eventCost;
          sightseeingMoney.count += 1;
          sightseeingMoney.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
        case 'check-in':
          Checkin.price += +elem.eventCost;
          Checkin.count += 1;
          Checkin.time += (dayjs(elem.endTrip).diff(dayjs(elem.startTrip)));
          break;
      }
    });

    const priceData = [busMoney, taxiMoney, trainMoney, shipMoney, transportMoney, driveMoney, flightMoney, restaurantMoney, sightseeingMoney, Checkin].filter((el) => el.count > 0);

    switch (SpendOrLabelsBySpendOrCountOrLabelsByCountOrTimeOrLabelsByTime) {
      case 'Spend':
        return priceData.sort((a, b) => b.price - a.price).map((el) => el.price);
      case 'LabelsBySpend':
        return priceData.sort((a, b) => b.price - a.price).map((el) => el.title);
      case 'Count':
        return priceData.sort((a, b) => b.count - a.count).map((el) => el.count);
      case 'LabelsByCount':
        return priceData.sort((a, b) => b.count - a.count).map((el) => el.title);
      case 'Time':
        return priceData.sort((a, b) => b.time - a.time).map((el) => el.time);
      case 'LabelsByTime':
        return priceData.sort((a, b) => b.time - a.time).map((el) => el.title);
      default:
        throw new Error('Miss Data or labelsPrice or Count');
    }
  }

  renderCharts() {
    this.renderMoneyChart();
    this.renderTypeChart();
    this.renderTimeChart();
  }

  renderMoneyChart() {
    const moneyCtx = document.querySelector('#money');
    moneyCtx.height = BAR_HEIGHT * 5;

    new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        // Какие точки есть в наличии
        labels: this._getPointData('LabelsBySpend'),
        datasets: [{
          // какие суммы потрачены
          data: this._getPointData('Spend'),
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `€ ${val}`,
          },
        },
        title: {
          display: true,
          text: 'MONEY',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  renderTypeChart() {
    const typeCtx = document.querySelector('#type');
    typeCtx.height = BAR_HEIGHT * 5;

    new Chart(typeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: this._getPointData('LabelsByCount'),
        datasets: [{
          data: this._getPointData('Count'),
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `${val}x`,
          },
        },
        title: {
          display: true,
          text: 'TYPE',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  renderTimeChart() {
    const timeCtx = document.querySelector('#time-spend');
    timeCtx.height = BAR_HEIGHT * 5;

    new Chart(timeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: this._getPointData('LabelsByTime'),
        datasets: [{
          data: this._getPointData('Time'),
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `${getDuration(val).toUpperCase()}`,
          },
        },
        title: {
          display: true,
          text: 'TIME',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
