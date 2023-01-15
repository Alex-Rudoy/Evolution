import { Chart, registerables } from "chart.js";

import { Creature } from "../entities/Creature";
import { Graveyard } from "./Graveyard";

import {
  BLUE_FACTION_COLOR,
  GREEN_FACTION_COLOR,
  MAX_AGE_BLUE_COLOR,
  MAX_AGE_GREEN_COLOR,
  MAX_AGE_RED_COLOR,
  RED_FACTION_COLOR,
} from "../utils/constants";

export class ChartManager {
  chart: Chart;

  constructor() {
    const chartCanvas = document.getElementById("chart") as HTMLCanvasElement;
    Chart.register(...registerables);
    this.chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          this.generateDataset("avg red age", RED_FACTION_COLOR),
          this.generateDataset("max red age", MAX_AGE_RED_COLOR),
          this.generateDataset("avg green age", GREEN_FACTION_COLOR),
          this.generateDataset("max green age", MAX_AGE_GREEN_COLOR),
          this.generateDataset("avg blue age", BLUE_FACTION_COLOR),
          this.generateDataset("max blue age", MAX_AGE_BLUE_COLOR),
        ],
      },
    });
  }

  generateDataset(label: string, color: string) {
    return {
      label,
      borderColor: color,
      data: [],
      tension: 0.2,
      pointRadius: 0,
    };
  }

  updateChart(graveyard: Graveyard) {
    const avgRedAge = this.getAvgAge(graveyard.red);
    const maxRedAge = this.getMaxAge(graveyard.red);
    const avgGreenAge = this.getAvgAge(graveyard.green);
    const maxGreenAge = this.getMaxAge(graveyard.green);
    const avgBlueAge = this.getAvgAge(graveyard.blue);
    const maxBlueAge = this.getMaxAge(graveyard.blue);

    if (this.chart.data.datasets[0].data.length > 50) {
      this.chart.data.datasets.forEach((dataset) => dataset.data.shift());
    } else {
      this.chart.data.labels?.push?.("");
    }
    this.chart.data.datasets[0].data.push(avgRedAge);
    this.chart.data.datasets[1].data.push(maxRedAge);
    this.chart.data.datasets[2].data.push(avgGreenAge);
    this.chart.data.datasets[3].data.push(maxGreenAge);
    this.chart.data.datasets[4].data.push(avgBlueAge);
    this.chart.data.datasets[5].data.push(maxBlueAge);
    this.chart.update();
  }

  getAvgAge(creatures: Creature[]) {
    let sum = 0;
    for (const creature of creatures) {
      sum += creature.age;
    }
    return sum / creatures.length;
  }

  getMaxAge(creatures: Creature[]) {
    let maxAge = 0;
    for (const creature of creatures) {
      if (creature.age > maxAge) {
        maxAge = creature.age;
      }
    }
    return maxAge;
  }
}
