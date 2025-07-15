import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Q1'18", "Q2'18", "Q3'18", "Q4'18"],
  datasets: [
    {
      label: "Valores aprovados",
      data: [100, 410, 610, 390],
      backgroundColor: "#007CF8",
      categoryPercentage: 0.4,
      order: 1,
    },
    {
      label: "Valores executado",
      data: [800, 400, 50, 120],
      backgroundColor: "#E6F2FE",
      categoryPercentage: 0.4,
      order: 2,
    }
  ]
};

const options = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      display: true,
      align: "start", 
      labels: {
        usePointStyle: true, // faz o marcador ficar redondo
        pointStyle: "circle",
        boxWidth: 8,        // tamanho do círculo
      },
    }
  },
  scales: {
    x: {
      position: "top",
      stacked: true,
      grid: {
        display: true,
        drawBorder: false,
      },
      border: {
        display: false
      }
    },
    y: {
      stacked: true,
      ticks: { display: false },
      grid: {
        display: false
      }
    }
  }
};

const titleAboveBarsPlugin = {
  id: "titleAboveBars",
  afterDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;
    ctx.save();
    ctx.font = "bold 12px sans-serif";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";

    const yScale = scales.y;

    data.labels.forEach((label, index) => {
      const yPos = yScale.getPixelForTick(index);
      ctx.fillText(`Título ${label}`, chart.chartArea.left, yPos - 45);
    });

    ctx.restore();
  }
};

const buttonBelowBarsPlugin = {
  id: "buttonBelowBars",
  afterDatasetsDraw(chart) {
    const { ctx, data, chartArea } = chart;
    ctx.save();

    ctx.font = "12px sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((bar, index) => {
      const xPos = chartArea.left + 40; // um pouco antes do eixo y (barra)
      const yPos = bar.y + bar.height / 2 + 30; // 15px abaixo da barra

      const buttonWidth = 80;
      const buttonHeight = 22;
      const buttonX = xPos - buttonWidth / 2;
      const buttonY = yPos - buttonHeight / 2;

      // Desenha o retângulo do botão
      ctx.fillStyle = "#1976d2";
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 6);
      ctx.fill();

      // Texto do botão
      ctx.fillStyle = "#fff";
      ctx.fillText("Clique aqui", xPos, yPos);
    });

    ctx.restore();
  }
};

// Para usar ctx.roundRect, definimos extensão se não tiver suporte nativo:
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

export default function App() {
  return (
    <div style={{ height: "900px", width: "100%" }}>
      <Bar data={data} options={options} plugins={[titleAboveBarsPlugin, buttonBelowBarsPlugin]} />
    </div>
  );
}
