document.addEventListener("DOMContentLoaded", function() {
  const hoursByProject = <%- JSON.stringify(hoursByProject) %>;

  const labels = hoursByProject.map(entry => entry.project_name);
  const data = hoursByProject.map(entry => entry.hours_worked);

  const projects = {
    labels: labels,
    datasets: [
      {
        label: "Hours Worked",
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
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
  };

  const donutChartCanvas = document.getElementById("donutChart");
  const donutChart = new Chart(donutChartCanvas, {
    type: "doughnut",
    data: projects,
    options: {
      responsive: true,
      legend: {
        position: "right",
      },
    },
  });
});