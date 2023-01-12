import { MUTATION_RATE } from "../utils/constants";
import { randomBetween } from "../utils/randomBetween";
import { sigmoid } from "../utils/sigmoid";

export class Layer {
  weights: number[][];
  biases: number[];

  constructor({ parentLayer, inputSize, outputSize }: constructorProps) {
    if (parentLayer) {
      this.weights = parentLayer.weights.map((weight) => [...weight]);
      this.biases = [...parentLayer.biases];
    } else {
      if (!inputSize || !outputSize) {
        throw new Error("inputSize and outputSize are required");
      }
      this.weights = [];
      this.biases = [];

      for (let i = 0; i < outputSize; i++) {
        this.weights.push([]);
        for (let j = 0; j < inputSize; j++) {
          this.weights[i].push(randomBetween(-4, 4));
        }
        this.biases.push(randomBetween(-2, 2));
      }
    }
    this.mutate();
  }

  mutate() {
    this.weights.forEach((neuronWeights) => {
      neuronWeights.forEach((_, i) => {
        if (Math.random() < MUTATION_RATE) {
          neuronWeights[i] = randomBetween(-4, 4);
        }
      });
    });

    this.biases.forEach((_, i) => {
      if (Math.random() < MUTATION_RATE) {
        this.biases[i] = randomBetween(-2, 2);
      }
    });
  }

  calculate(inputs: number[]): number[] {
    return this.weights.map((neuronWeights, neuronIndex) =>
      sigmoid(
        neuronWeights.reduce((acc, weight, i) => {
          return acc + weight * inputs[i];
        }, 0) + this.biases[neuronIndex]
      )
    );
  }
}

type constructorProps =
  | {
      parentLayer: Layer;
      inputSize?: undefined;
      outputSize?: undefined;
    }
  | {
      parentLayer?: undefined;
      inputSize: number;
      outputSize: number;
    };
