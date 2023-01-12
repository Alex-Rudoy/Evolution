export type factionType = {
  id: number;
  name: "red" | "green" | "blue";
  color: string;
  coefficients: {
    red: number;
    green: number;
    blue: number;
  };
};
