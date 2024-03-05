import { identity, type ActivationFunction } from "./activation";


class Perceptron {

    static init = () => Math.random() * 2 - 1;

    bias: number;
    weights: number[];

    constructor(input: number) {
        this.bias = Perceptron.init();
        this.weights = Array.from(Array(input), Perceptron.init);
    }

    forward(inputs: number[]) {
        return this.weights.reduce((total, weight, i) => total + weight * inputs[i], this.bias);
    }

}

class Layer {

    nodes: Perceptron[];
    activate: ActivationFunction;

    constructor(input: number, output: number, activation = identity) {
        this.nodes = Array.from(Array(output), () => new Perceptron(input));
        this.activate = activation;
    }

    forward(inputs: number[]) {
        return this.nodes.map(node => node.forward(inputs));
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

}
