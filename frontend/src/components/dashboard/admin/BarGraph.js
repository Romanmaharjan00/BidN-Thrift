import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarGraph = ({ productCount, orderCount }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Bidding Product Count", "Normal Product Count"],
          datasets: [
            {
              label: "Count",
              data: [productCount, orderCount],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)", // Red for Product Count
                "rgba(54, 162, 235, 0.6)", // Blue for Order Count
              ],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Bidding and Normal Product ratio",
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [productCount, orderCount]);

  return (
    <div>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
};

export default BarGraph;
