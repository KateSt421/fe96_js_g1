const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        datasets: [
            {
                label: 'Погибшие деревья(вырубка, пожары)',
                data: [10, 20, 6, 4, 5, 16, 7, 4, 3, 2, 0, 0],
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
                fill: false,
            },
            {
                label: 'Посаженые деревья',
                data: [0, 0, 125, 235, 45, 55, 65, 24,0,0,0,0],
                borderColor: 'rgba(54, 162, 235, 1)',
                yAxisID: 'y2',
                fill: false,
            },
            {
                label: 'Выросшие деревья(5 и более лет)',
                data: [2, 12, 22, 32, 42, 52, 62, 54,34,2,2,2],
                borderColor: 'rgba(75, 192, 192, 1)',
                yAxisID: 'y3',
                fill: false,
            }
        ]
    },
    options: {
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
            },
            y2: {
                type: 'linear',
                position: 'right',
                gridLines: {
                    drawOnChartArea: false // Не рисовать сетку для правой оси
                }
            },
            y3: {
                type: 'linear',
                position: 'right',
                gridLines: {
                    drawOnChartArea: false // Не рисовать сетку для правой оси
                },
                ticks: {
                    callback: function(value) { return value; } // Настройка отображения значений
                }
            }
        }
    }
});
