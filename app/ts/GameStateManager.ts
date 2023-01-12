import { Creature } from "./classes/Creature";
import { Food } from "./classes/Food";

import { SKIP_SECONDS_ELAPSED_PER_TURN } from "./utils/constants";
import { blueFaction, greenFaction, redFaction } from "./utils/factions";
import { weightedRandomIndex } from "./utils/weightedRandomIndex";

export default class GameStateManager {
  generation: number;
  creatures: Creature[];
  graveyard: Creature[];
  foods: Food[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fullSeconds: number;
  isSkipActive: boolean;
  skipAmount: number;

  skipButton: HTMLButtonElement;
  skipAmountInput: HTMLInputElement;

  constructor() {
    this.generation = 0;
    this.creatures = [];
    this.graveyard = [];
    this.foods = [];
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.fullSeconds = 0;
    this.isSkipActive = false;
    this.skipAmount = 10;

    this.skipButton = document.getElementById(
      "skipButton"
    ) as HTMLButtonElement;
    this.skipAmountInput = document.getElementById(
      "skipAmount"
    ) as HTMLInputElement;
    this.skipAmountInput.value = this.skipAmount.toString();

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
    this.skipButton.addEventListener("click", this.startSkip);
    this.skipAmountInput.addEventListener("input", this.handleSkipAmountChange);
    this.canvas.addEventListener("click", this.handleCanvasClick);
  }

  start() {
    [redFaction, blueFaction, greenFaction].forEach((faction) => {
      if (this.generation === 0) {
        for (let i = 0; i < 50; i++) {
          this.creatures.push(new Creature({ faction: faction }));
        }
      } else {
        const factionGraveyard = this.graveyard.filter(
          (creature) => creature.faction.id === faction.id
        );
        const ageMap = factionGraveyard.map((creature) => creature.age);
        for (let i = 0; i < 50; i++) {
          const weightedRandomCreatureIndex = weightedRandomIndex(ageMap); // the older the creature, the higher chance it will be chosen
          this.creatures.push(
            new Creature({
              parent: factionGraveyard[weightedRandomCreatureIndex],
            })
          );
        }
      }
    });
    this.foods = [];
    for (let i = 0; i < 50; i++) {
      this.foods.push(new Food());
    }
  }

  loop(secondsPassed: number) {
    if (this.isSkipActive) return;
    this.makeDecisions(secondsPassed);
    this.move(secondsPassed);
    this.resolveColliders(secondsPassed);
    this.updateValues(secondsPassed);
    this.tick(secondsPassed);
    this.checkDead();
    this.checkRestart();
    // this.everySecond();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // remove previous frame
    this.creatures.forEach((creature) => {
      creature.draw(this.ctx);
    });
    this.foods.forEach((food) => food.draw(this.ctx));
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

  tick(secondsPassed: number) {
    this.creatures.forEach((creature) => creature.tick(secondsPassed));
  }

  resolveColliders(secondsPassed: number) {
    // colliding with others
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

  moveUnitsAway(creature1: Creature, creature2: Creature) {
    const vectorBetween = creature1.getVectorTo(creature2);
    vectorBetween.setLength(
      vectorBetween.length - creature1.size - creature2.size
    );
    creature1.forceMove(vectorBetween.divideBy(2));
    creature2.forceMove(vectorBetween.divideBy(-2));
  }

  damageBoth(creature1: Creature, creature2: Creature, secondsPassed: number) {
    creature1.takeDamageFrom(creature2, secondsPassed);
    creature2.takeDamageFrom(creature1, secondsPassed);
  }

  updateValues(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.energy = Math.max(creature.energy - secondsPassed * 20, 0);
      creature.age += secondsPassed;
      const hpPromille = creature.maxHP / 1000; // 0.1% of maxHP - will be just 1 HP with default HP
      const energyDeficit = 100 - creature.energy;
      creature.takeDamage(creature.age * 5 * secondsPassed * hpPromille); // 0.5% maxHP per second, per 1 second of age
      creature.takeDamage((energyDeficit / 2) * secondsPassed * hpPromille); // 5% maxHP per second at 0 energy
      creature.takeDamage((energyDeficit / 2) * secondsPassed); // flat 50 damage per second at 0 energy
    });
  }

  checkDead() {
    this.creatures = this.creatures.filter((creature) => {
      if (!creature.toDestroy) return true;
      this.graveyard.push(creature);
      if (creature.isAttacked) {
        this.foods.push(new Food(creature));
        this.foods.push(new Food(creature));
        this.foods.push(new Food(creature));
      }
      return false;
    });

    this.foods = this.foods.filter((food) => !food.toDestroy);
  }

  checkRestart() {
    if (!this.creatures.length) {
      this.increaseGenerationCount();
      console.log("new gen");
      this.start();
    }
  }

  increaseGenerationCount() {
    this.generation++;
    document.getElementById("generation")!.innerText =
      this.generation.toString();
  }

  everySecond() {
    // if (this.totalTime > this.fullSeconds + 1) {
    //   this.fullSeconds++;
    //   if (Math.random() + 0.3 > this.creatures.length / 100) {
    //     // more population - less food
    //     this.foods.push(new Food());
    //   }
    // }
  }

  startSkip() {
    console.log("start skipping");
    this.isSkipActive = true;
    const targetGeneration = this.generation + this.skipAmount;
    console.log(this.generation, targetGeneration);
    while (this.generation < targetGeneration) {
      this.makeDecisions(SKIP_SECONDS_ELAPSED_PER_TURN);
      this.move(SKIP_SECONDS_ELAPSED_PER_TURN);
      this.resolveColliders(SKIP_SECONDS_ELAPSED_PER_TURN);
      this.updateValues(SKIP_SECONDS_ELAPSED_PER_TURN);
      this.tick(SKIP_SECONDS_ELAPSED_PER_TURN);
      this.checkDead();
      this.checkRestart();
    }
    this.isSkipActive = false;
    console.log("end skipping");
  }

  handleSkipAmountChange(e: Event) {
    console.log(e);
    const input = e.target as HTMLInputElement;
    console.log(input, input.value, !input.value.match(/^[0-9]$/gi));
    if (!input.value.match(/^[0-9]$/gi)) {
      input.value = this.skipAmount.toString();
      return;
    }
    this.skipAmount = parseInt(input.value, 10);
    this.skipButton.innerText = `Skip ${input.value} generations`;
  }

  handleCanvasClick(e: Event) {
    //
  }
}
