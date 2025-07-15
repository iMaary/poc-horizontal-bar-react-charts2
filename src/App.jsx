import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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
    },
  ],
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
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 8,
      },
    },
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
        display: false,
      },
    },
    y: {
      stacked: true,
      ticks: { display: false },
      grid: {
        display: false,
      },
    },
  },
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
  },
};

// Remove o plugin que desenha botão no canvas (não será mais necessário)
// const buttonBelowBarsPlugin = {...} 

export default function App() {
  const chartRef = useRef(null);
  const [buttonPositions, setButtonPositions] = useState([]);

  // Atualiza posições dos botões após o gráfico renderizar
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const meta = chart.getDatasetMeta(0); // Pegando o primeiro dataset
    const positions = meta.data.map((bar) => {
      return { x: bar.x, y: bar.y, height: bar.height };
    });

    setButtonPositions(positions);
  }, [data]);

  return (
    <div style={{ position: "relative", height: "900px", width: "100%" }}>
      <Bar
        ref={chartRef}
        data={data}
        options={options}
        plugins={[titleAboveBarsPlugin]}
      />
      {/* Botões React reais posicionados em relação às barras */}
      {buttonPositions.map((pos, i) => (
        <button
          key={i}
          style={{
            position: "absolute",
            left: pos.x + 40,
            top: pos.y + pos.height / 2 + 20, // 30px abaixo do centro da barra
            transform: "translate(-50%, 0)",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            height: 22,
            width: 80,
            cursor: "pointer",
            fontSize: 12,
            zIndex: 10,
          }}
          onClick={() => alert(`Botão da barra ${data.labels[i]}`)}
        >
          Clique aqui
        </button>
      ))}
    </div>
  );
}
