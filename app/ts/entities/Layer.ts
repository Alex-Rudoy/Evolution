import { Brain } from "./Brain";

import { MUTATION_RATE } from "../utils/constants";
import { randomBetween } from "../utils/randomBetween";
import { sigmoid } from "../utils/sigmoid";

export class Layer {
  weights: number[][];
  biases: number[];
  brain: Brain;

  constructor({
    parentLayer,
    mutate,
    inputSize,
    outputSize,
    brain,
  }: constructorProps) {
    this.brain = brain;
    if (parentLayer) {
      this.weights = parentLayer.weights.map((weight) => [...weight]);
      this.biases = [...parentLayer.biases];
      if (mutate) this.mutate();
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
    if (this.brain.me.isSelected) {
      console.log(inputs);
    }
    return this.weights.map((neuronWeights, neuronIndex) =>
      sigmoid(
        neuronWeights.reduce((acc, weight, i) => {
          return acc + weight * inputs[i];
        }, 0) + this.biases[neuronIndex]
      )
    );
  }
}

type constructorProps = {
  brain: Brain;
  parentLayer?: Layer;
  inputSize?: number;
  outputSize?: number;
  mutate?: boolean;
};
