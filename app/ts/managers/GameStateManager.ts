import { ChartManager } from './ChartManager';
import { Graveyard } from './Graveyard';
import { Creature } from '../entities/Creature';
import { Food } from '../entities/Food';
import { Vector } from '../entities/Vector';

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_REASONABLE_TICK_TIME,
} from '../utils/constants';
import { blueFaction, greenFaction, redFaction } from '../utils/factions';

export default class GameStateManager {
  generation: number;
  creatures: Creature[] = [];
  graveyard: Graveyard;
  foods: Food[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isSkipActive: boolean;
  skipAmount: number;

  chartManager: ChartManager;

  skipButton: HTMLButtonElement;
  skipAmountInput: HTMLInputElement;

  constructor() {
    this.generation = 0;
    this.graveyard = new Graveyard();
    this.canvas = document.getElementById('field') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.isSkipActive = false;
    this.skipAmount = 100;

    this.skipButton = document.getElementById(
      'skipButton',
    ) as HTMLButtonElement;
    this.skipAmountInput = document.getElementById(
      'skipAmount',
    ) as HTMLInputElement;
    this.skipAmountInput.value = this.skipAmount.toString();

    this.chartManager = new ChartManager();

    this.bindMethods();
    this.addEventListeners();
    this.start();
  }

  bindMethods() {
    this.startSkip = this.startSkip.bind(this);
    this.handleSkipAmountChange = this.handleSkipAmountChange.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
  }

  addEventListeners() {
    this.skipButton.addEventListener('click', this.startSkip);
    this.skipAmountInput.addEventListener('input', this.handleSkipAmountChange);
    this.canvas.addEventListener('click', this.handleCanvasClick);
  }

  start() {
    this.creatures = [];
    this.foods = [];

    [redFaction, greenFaction, blueFaction].forEach((faction) => {
      if (this.generation === 0) {
        for (let i = 0; i < 15; i++) {
          this.creatures.push(new Creature({ faction }));
        }
      } else {
        this.graveyard
          .getTop5CreaturesFromFaction(faction)
          .forEach((creature) => {
            this.creatures.push(
              new Creature({
                parent: creature,
                mutate: false,
                faction: creature.faction,
              }),
            );
          });

        for (let i = 0; i < 10; i++) {
          // the older the creature, the higher chance it will be chosen
          this.creatures.push(
            new Creature({
              parent: this.graveyard.getRandomWeightedCreature(),
              mutate: true,
              faction,
            }),
          );
        }
      }
    });

    for (let i = 0; i < 50; i++) {
      this.foods.push(new Food());
    }
    this.graveyard.reset();
  }

  loop(secondsPassed: number) {
    if (this.isSkipActive) return;
    const limitedSecondsPassed = Math.min(
      secondsPassed,
      MAX_REASONABLE_TICK_TIME,
    );
    // const limitedSecondsPassed = MAX_REASONABLE_TICK_TIME;
    this.makeDecisions(limitedSecondsPassed);
    this.move(limitedSecondsPassed);
    this.resolveColliders(limitedSecondsPassed);
    this.updateValues(limitedSecondsPassed);
    this.removeEntitiesToDestroy();
    this.checkRestart();
    this.draw();
  }

  makeDecisions(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.makeDecision(this.creatures, this.foods, secondsPassed);
    });
  }

  move(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.move(secondsPassed);
    });
    this.foods.forEach((food) => {
      food.move(secondsPassed);
    });
  }

  resolveColliders(secondsPassed: number) {
    this.creatures.forEach((creature1) => {
      this.creatures.forEach((creature2) => {
        if (creature1.collidesWith(creature2)) {
          this.moveUnitsAway(creature1, creature2);

          if (creature1.faction.id !== creature2.faction.id) {
            this.damageBoth(creature1, creature2, secondsPassed);
          }
        }
      });
      this.foods.forEach((food) => {
        if (creature1.collidesWith(food)) {
          food.toDestroy = true;
          creature1.eatFood();
        }
      });
    });
  }

  updateValues(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.updateValuesPerTick(secondsPassed);
    });
  }

  removeEntitiesToDestroy() {
    this.creatures = this.creatures.filter((creature) => {
      if (!creature.toDestroy) return true;

      this.moveToGraveyard(creature);
      if (creature.isAttacked) {
        this.spawnFoodFromCorpse(creature);
      }
      return false;
    });

    this.foods = this.foods.filter((food) => !food.toDestroy);
  }

  checkRestart() {
    if (!this.creatures.length) {
      this.increaseGenerationCount();
      this.chartManager.updateChart(this.graveyard);
      this.start();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // remove previous frame
    this.creatures.forEach((creature) => {
      creature.draw(this.ctx);
    });
    this.foods.forEach((food) => food.draw(this.ctx));
  }

  moveUnitsAway(creature1: Creature, creature2: Creature) {
    const vectorBetween = creature1.getVectorTo(creature2);
    vectorBetween.setLength(
      vectorBetween.length - creature1.size - creature2.size,
    );
    creature1.forceMove(vectorBetween.divideBy(2));
    creature2.forceMove(vectorBetween.divideBy(-2));
  }

  damageBoth(creature1: Creature, creature2: Creature, secondsPassed: number) {
    creature1.takeDamageFrom(creature2, secondsPassed);
    creature2.takeDamageFrom(creature1, secondsPassed);
  }

  moveToGraveyard(creature: Creature) {
    this.graveyard[creature.faction.name].push(creature);
  }

  spawnFoodFromCorpse(creature: Creature) {
    this.foods.push(new Food(creature), new Food(creature), new Food(creature));
  }

  increaseGenerationCount() {
    this.generation++;
    document.getElementById('generation')!.innerText =
      this.generation.toString();
  }

  startSkip() {
    this.isSkipActive = true;
    const targetGeneration = this.generation + this.skipAmount;
    while (this.generation < targetGeneration) {
      this.makeDecisions(MAX_REASONABLE_TICK_TIME);
      this.move(MAX_REASONABLE_TICK_TIME);
      this.resolveColliders(MAX_REASONABLE_TICK_TIME);
      this.updateValues(MAX_REASONABLE_TICK_TIME);
      this.removeEntitiesToDestroy();
      this.checkRestart();
    }
    this.isSkipActive = false;
  }

  handleSkipAmountChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.value.match(/^[0-9]*$/gi)) {
      input.value = this.skipAmount.toString();
      return;
    }
    this.skipAmount = input.value ? parseInt(input.value, 10) : 0;
    this.skipAmountInput.value = this.skipAmount.toString();
    this.skipButton.innerText = `Skip ${input.value} generations`;
  }

  handleCanvasClick(e: MouseEvent) {
    const canvasWidth = window.innerWidth - 316;
    const canvasHeight = window.innerHeight - 2;
    const clickX = (e.clientX / canvasWidth) * CANVAS_WIDTH;
    const clickY = (e.clientY / canvasHeight) * CANVAS_HEIGHT;
    let removeSelection = false;
    this.creatures.forEach((creature) => {
      if (creature.isSelected) {
        creature.isSelected = false;
        removeSelection = true;
      }
    });
    if (removeSelection) return;
    this.creatures.sort(
      (a, b) =>
        a.position.subtract(new Vector(clickX, clickY)).length -
        b.position.subtract(new Vector(clickX, clickY)).length,
    )[0].isSelected = true;
  }
}
