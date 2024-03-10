export interface ActivationFunction {
  forward(value: number): number;
  backward(value: number, result: number): number;
}

export const identity: ActivationFunction = {
  forward: (i) => i,
  backward: () => 1,
};

export const relu: ActivationFunction = {
  forward: (value) => Math.max(0, value),
  backward: (value) => value < 0 ? 0 : 1,
};

export const prelu = (param = 0.1): ActivationFunction => ({
  forward: (value) => value < 0 ? param * value : value,
  backward: (value) => value < 0 ? param : 1,
});

export const lrelu = prelu(0.1);

export const sigmoid: ActivationFunction = {
  forward: (value) => 1 / (1 + Math.exp(-value)),
  backward: (_, result) => result * (1 - result),
};

export const tanh: ActivationFunction = {
  forward: (value) => {
    const p = Math.exp(value);
    const n = Math.exp(-value);
    return (p - n) / (p + n);
  },
  backward: (_, result) => 1 - (result * result),
};
