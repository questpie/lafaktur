import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export function LineChart() {
  const { theme } = useTheme();

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Month",
          },
          grid: {
            color:
              theme === "dark"
                ? "hsla(0, 0%, 100%, 0.1)"
                : "hsla(0, 0%, 0%, 0.1)",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Value",
          },
          grid: {
            color:
              theme === "dark"
                ? "hsla(0, 0%, 100%, 0.1)"
                : "hsla(0, 0%, 0%, 0.1)",
          },
        },
      },
    }),
    [theme],
  );

  return <Line data={data} options={options} />;
}
