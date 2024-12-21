import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ data }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      console.log("Data received:", data);

      const ctx = chartContainer.current.getContext("2d");

      const chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Men", "Women", "Kids"],
          datasets: [
            {
              label: "Products by Category",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)", // Red for Men
                "rgba(54, 162, 235, 0.6)", // Blue for Women
                "rgba(255, 206, 86, 0.6)", // Yellow for Kids
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Products by Category",
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data]);

  return (
    <div>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
};

export default PieChart;
