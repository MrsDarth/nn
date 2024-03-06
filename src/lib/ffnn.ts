import { identity, type ActivationFunction } from "./activation";

export class Perceptron {

    private static init = () => Math.random() * 2 - 1;
    static learnRate = 0.001;

    bias: number;
    weights: number[];

    constructor(input: number) {
        this.bias = Perceptron.init();
        this.weights = Array.from(Array(input), Perceptron.init);
        this.biasGrad = 0;
        this.weightGrads = Array(input).fill(0);
    }

    private inputs!: number[];

    forward(inputs: number[]) {
        this.inputs = inputs;
        return this.weights.reduce((total, weight, i) => total + weight * inputs[i], this.bias);
    }

    private biasGrad: number;
    private weightGrads: number[];

    backward(derivative: number, inputDerivatives: number[]) {
        this.biasGrad += derivative;
        for (let i = 0; i < this.inputs.length; i++) {
            this.weightGrads[i] += this.inputs[i] * derivative;
            inputDerivatives[i] += this.weights[i] * derivative;
        }
        return inputDerivatives;
    }

    applyGradients() {
        this.bias -= this.biasGrad * Perceptron.learnRate;
        for (let i = 0; i < this.weights.length; i++)
            this.weights[i] -= this.weightGrads[i] * Perceptron.learnRate;
        this.biasGrad = 0;
        this.weightGrads.fill(0);
    }

}

class Layer {

    input: number;
    nodes: Perceptron[];
    activate: ActivationFunction;

    constructor(input: number, output: number, activation = identity) {
        this.input = input;
        this.nodes = Array.from(Array(output), () => new Perceptron(input));
        this.activate = activation;
    }

    private values!: number[];
    private results!: number[];

    forward(inputs: number[]) {
        this.values = this.nodes.map(node => node.forward(inputs));
        this.results = this.values.map(this.activate.forward);
        return this.results;
    }

    backward(derivatives: number[]) {
        const activateDerivative = derivatives.map((d, i) => d * this.activate.backward(this.values[i], this.results[i]));
        return this.nodes.reduce((inputDerivatives, node, i) => node.backward(activateDerivative[i], inputDerivatives), new Array<number>(this.input).fill(0));
    }

}

export interface LayerInit {
    nodes: number;
    activate?: ActivationFunction;
}

export default class FeedForwardNetwork {
    
    layers: Layer[];

    constructor(input: number, ...layers: LayerInit[]) {
        this.layers = new Array(layers.length);
        for (let i = 0; i < layers.length; i++) {
            const { nodes, activate } = layers[i];
            this.layers[i] = new Layer(input, nodes, activate);
            input = nodes;
        }
    }

    forward(inputs: number[]) {
        return this.layers.reduce((input, layer) => layer.forward(input), inputs);
    }

    train(inputs: number[], expected: number[]) {
        const costDerivative = this.forward(inputs).map((output, i) => 2 * (output - expected[i]));
        this.layers.reduceRight((inputDerivatives, layer) => layer.backward(inputDerivatives), costDerivative);
        for (const layer of this.layers)
            for (const node of layer.nodes)
                node.applyGradients();
    }

}
