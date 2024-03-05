
export interface ActivationFunction {
    forward(value: number): number;
}

export const identity: ActivationFunction = {
    forward: i => i
}
