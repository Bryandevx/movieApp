const getFilter = document.getElementById("filter");
const getYear = document.getElementById("year");
const getChart = document.getElementById("chart");
const getRevenueCheck = document.getElementById("revenueCheck");
const getTableContainer = document.getElementById("table-container");
const apiKey = `da6e9e4514adf637c5e67be9a72751f6`;

let apiData;
let movieNames = [];
let chartData = [];
let revenues = [];

getTableContainer.style.visibility = "hidden";

const callApi = async (filter, year) => {
  const response = await fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=" +
      apiKey +
      "&primary_release_year=" +
      year +
      "&sort_by=" +
      filter +
      ".desc"
  );
  const data = await response.json();
  console.log(data);
  return data;
};

const setParameters = async () => {
  let filter = getFilter.options[getFilter.selectedIndex].text;
  let year = getYear.options[getYear.selectedIndex].text;
  let chart = getChart.options[getChart.selectedIndex].text;
  let check = getRevenueCheck.checked;

  apiData = await callApi(filter, year);

  substractMovieData(filter, chart);
};

const substractMovieData = async (attr, chart) => {
  let results = apiData.results;

  for (let i = 0; i < 5; i++) {
    movieNames.push(results[i].original_title);
    chartData.push(results[i][attr]);
  }

  console.log(chartData);
  await calculateRevenues(results);
  drawChart(chart);
};

const calculateRevenues = async (results) => {

  for (let i = 0; i < 5; i++) {
    let rawID = results[i].id;
    let movieID = rawID.toString();

    let response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieID +
        "?api_key=" +
        apiKey +
        "&language=en-US"
    );
    let movie = await response.json();
    revenues.push(movie.revenue);
  }

  clearRevenueInfo();
  fillTable();
};


const fillTemplate = ()=>{
  let template = '';

  if(revenues.length == movieNames.length){
    
    let can = revenues.length; // optional, you can also use movieNames length, both arrays have the same length

    for(let i=0; i < can; i++){
      template += `
      <tr class="">
        <td class="">`+movieNames[i]+`</td>
        <td class="">`+revenues[i]+`</td>
      </tr>
      `
    }

  } else{
    template = 'Matching error'
  }


return template
}

const fillTable = () => {

  let officialTemplate = fillTemplate();


  document.getElementById("movie-revenues").innerHTML = officialTemplate;

  if (getRevenueCheck.checked) {
    console.log("table must be shown");
    getTableContainer.style.visibility = "visible";
  } else {
    getTableContainer.style.visibility = "hidden";
    console.log("hidden ok");
  }
};

const clearRevenueInfo = () => {

  for (let i = 0; i < revenues.length; i++){
    if (revenues[i] == 0) revenues[i] = "NRP";
    console.log(revenues[i]);
  }

};

const drawChart = (type) => {
  const array = [1, 2, 3, 4, 5, 6];
  var ctx = document.getElementById("myChart").getContext("2d");
  if (window.bar != undefined) window.bar.destroy();
  window.bar = new Chart(ctx, {
    type: type,
    data: {
      labels: movieNames,
      datasets: [
        {
          label: "# of Votes",
          data: chartData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },

    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });



  chartData = [];
  movieNames = [];
  revenues = [];
};
