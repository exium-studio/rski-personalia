import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
  cutout?: number;
}
export default function ChartDoughnut({
  labels,
  datasets,
  cutout = 60,
}: Props) {
  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    tooltip: {
      tooltip: false,
    },
    cutout: cutout,
  };

  return <Doughnut data={data} options={options} />;
}
