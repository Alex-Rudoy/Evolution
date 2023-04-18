export const CANVAS_WIDTH = 1600;
export const HALF_CANVAS_WIDTH = CANVAS_WIDTH / 2;
export const CANVAS_HEIGHT = 900;
export const HALF_CANVAS_HEIGHT = CANVAS_HEIGHT / 2;
export const HALF_OF_CANVAS_DIAGONAL =
  Math.sqrt(CANVAS_WIDTH ** 2 + CANVAS_HEIGHT ** 2) / 2;

export const EIGTHS_OF_CIRCLE = Math.PI / 4;

export const MUTATION_RATE = 1 / 5000;

export const PERSONAL_INPUTS_COUNT = 3;
export const CREATURE_INPUTS_COUNT = 8;
export const CLOSEST_CREATURE_COUNT = 5;
export const FOOD_INPUTS_COUNT = 3;
export const CLOSEST_FOOD_COUNT = 5;
export const INPUT_LAYER_SIZE =
  PERSONAL_INPUTS_COUNT +
  CREATURE_INPUTS_COUNT * CLOSEST_CREATURE_COUNT +
  FOOD_INPUTS_COUNT * CLOSEST_FOOD_COUNT;

export const HIDDEN_LAYER_1_SIZE = 50;
export const HIDDEN_LAYER_2_SIZE = 50;
export const HIDDEN_LAYER_3_SIZE = 50; // may be unused
export const OUTPUT_LAYER_SIZE = 8;

export const MAX_REASONABLE_TICK_TIME = 0.05;

export const SAME_FACTION_COEF = 1;
export const HIGHER_DAMAGE_COEF = 4;
export const LOWER_DAMAGE_COEF = 0.25;

export const RED_FACTION_COLOR = '#df4040';
export const GREEN_FACTION_COLOR = '#6acf6f';
export const BLUE_FACTION_COLOR = '#328dc2';
export const MAX_AGE_RED_COLOR = '#eb8e8e';
export const MAX_AGE_GREEN_COLOR = '#9feaa3';
export const MAX_AGE_BLUE_COLOR = '#75bce5';
