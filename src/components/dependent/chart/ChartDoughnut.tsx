import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Interface__ChartDoughnut } from "../../../constant/interfaces";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartDoughnut({
  labels,
  datasets,
  aspectRatio,
  cutout,
}: Interface__ChartDoughnut) {
  const data = {
    labels: labels,
    datasets: datasets,
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
    cutout: cutout,
  };

  return <Doughnut data={data} options={options} />;
}
