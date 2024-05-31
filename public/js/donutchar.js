// Assuming you have data representing time spent on different assignments
const projects = {
  labels: ["Assignment 1", "Assignment 2", "Assignment 3"],
  datasets: [
    {
      label: "Time Spent on Assignments",
      data: [20, 30, 50], // Example data (replace with your actual data)
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Get the canvas element
const donutChartCanvas = document.getElementById("donutChart");

// Create the donut chart
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
