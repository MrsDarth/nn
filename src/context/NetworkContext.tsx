import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react";
import FeedForwardNetwork, { LayerInit } from "../lib/ffnn";
import useRender from "../hooks/render";
import { prelu, relu, sigmoid, tanh } from "../lib/activation";

interface TrainingData {
    inputs: number[];
    expected: number[];
}

interface NeuralNetContext {
    network: FeedForwardNetwork;
    forward(inputs: number[]): number[];

    input: number;
    setInput(input: number): void;
    layers: LayerInit[];
    setLayers(layers: LayerInit[]): void;

    train(iterations?: number): void;
    setTrainingData(data: TrainingData[]): void;
}

const NetworkContext = createContext<NeuralNetContext>(null!);

export const useNeuralNet = () => useContext(NetworkContext);

export function NeuralNetProvider({ children }: PropsWithChildren) {
    const [renderDep, render] = useRender();
    const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
    const [input, setInput] = useState(1);
    const [layers, setLayers] = useState<LayerInit[]>(() => [{ nodes: 10, activate: tanh }, { nodes: 1 }]);
    const network = useMemo(() => new FeedForwardNetwork(input, ...layers), [input, layers]);
    const forward = useCallback((inputs: number[]) => network.forward(inputs), [network, renderDep]);
    const train = useCallback((iterations = 1) => {
        for (let i = 0; i < iterations; i++)
            for (const { inputs, expected } of trainingData)
                network.train(inputs, expected);
        render();
    }, [network, trainingData]);
    return (
        <NetworkContext.Provider
            value={{
                network, forward,
                train, setTrainingData,
                input, setInput,
                layers, setLayers
            }}
        >
            {children}
        </NetworkContext.Provider>
    )
}
