var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Death", "Recover", "Active Case"],
        datasets: [{
            label: 'COVID 19',
            data: [0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let regionSelectElement = document.querySelector('.region');

function regionSelect(provinsi, regionSelectElement) {
    regionSelectElement.innerHTML = provinsi;
}

async function getAlldata() {
    let provinsi = "<option>Choose Region</option>";
    let response = await fetch('https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json')
    let allData = await response.json();

    allData.features.forEach((val) => {
        provinsi += `<option>${val.attributes.Provinsi}</option>`;
    });
    regionSelect(provinsi, regionSelectElement);

    regionSelectElement.addEventListener("change", () => {
        let result = allData.features.filter((val) => val.attributes.Provinsi === regionSelectElement.value);
        document.getElementById("r1").innerHTML = `<h1>${result[0].attributes.Provinsi}</h1>`;
        document.getElementById("r2").innerHTML = `<h1>${result[0].attributes.Kasus_Meni}</h1>`;
        document.getElementById("r3").innerHTML = `<h1>${result[0].attributes.Kasus_Semb}</h1>`;
        document.getElementById("r4").innerHTML = `<h1>${result[0].attributes.Kasus_Posi}</h1>`;

        myChart.data.datasets[0].data = [result[0].attributes.Kasus_Meni, result[0].attributes.Kasus_Semb, result[0].attributes.Kasus_Posi];
        myChart.update();  
    });
}

getAlldata();