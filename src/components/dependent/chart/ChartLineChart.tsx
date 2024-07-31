import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Interface__ChartLine } from "../../../constant/interfaces";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function ChartLineChart({
  datasets,
  xLabel,
  yLabel,
  labels,
  aspectRatio,
}: Interface__ChartLine) {
  const data = {
    labels: labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      labels: dataset.data.map(() => ""), // Mengatur setiap label x menjadi kosong
    })),
  };

  const options = {
    aspectRatio: aspectRatio,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const dataset = context.dataset;
            const customLabel = dataset.customTooltipLabels[context.dataIndex];
            return ` ${customLabel}`;
          },
        },
        padding: 10,
      },
    },
    scales: {
      x: {
        title: {
          display: !!xLabel,
          text: xLabel,
        },
        ticks: {
          display: false, // Menyembunyikan label sumbu x
        },
      },
      y: {
        title: {
          display: !!yLabel,
          text: yLabel,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
