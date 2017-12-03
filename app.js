class App {
  constructor() {
    this.pusher = null;
    this.chart = null;
    this.lowestPrice = 505;
    this.initializeChart();
    this.initializePusher();
  }

  initializePusher() {
    Pusher.logToConsole = true;

    this.pusher = new Pusher('5ecd3e80a871b281764f', {
      cluster: 'eu',
      encrypted: true
    });
    this.subscribeToEventChannel();
  }

  subscribeToEventChannel() {
    const channel = this.pusher.subscribe('trade');
    channel.bind('stock', data => {
      this.updateChartData(data)
    });
  }

  updateChartData(data) {
    
    this.chart.data.labels.push(data.Timestamp.split(' ')[1].split('.')[0]);
    // this.chart.data.datasets[0].data.push(data.Price);
    this.chart.data.datasets[0].data.push(data.Price);
    document.getElementById('price').innerHTML = data.Price;

    this.chart.data.datasets.forEach(dataset => {
      var currentPrice = document.getElementById('price');
      var tag = currentPrice.innerHTML;
      tag = data.Price;
      this.flashColor(this.lowestPrice, tag, currentPrice);
    });
    this.chart.update();
  }

  flashColor(price, tag, currentPrice) {
    let color = " ";

    if (tag > price ) {
      color = "green";
    } else if(tag == price){
      color = "blue";
    } else {
      color = "red";
    }

    currentPrice.style.color = color;
    currentPrice.style.fontWeight = "bolder";
  }

  initializeChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    const data = {
      labels: [],
      datasets: [
        {
          label: 'GOOG',
          backgroundColor: 'rgb(125, 195, 242)',
          borderColor: 'rgb(54, 162, 235)',
          data: [],
          // fill: false
        }
      ]
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time  '
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Price'
              },
              ticks: {
                min: 504,
                max: 507
            }
            }
          ]
        }
      }
    });
  }
}

new App();
