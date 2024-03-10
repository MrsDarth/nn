import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react";
import FeedForwardNetwork, { LayerInit } from "../lib/ffnn";
import useRender from "../hooks/render";
import { sigmoid } from "../lib/activation";

interface TrainingData {
    inputs: number[];
    expected: number[];
}

interface NeuralNetContext {
    network: FeedForwardNetwork;
    forward(inputs: number[]): number[];

    input: number;
    output: number;
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
    const input = 1;
    const output = 1;
    const [layers, setLayers] = useState<LayerInit[]>(() => [{ nodes: 5, activate: sigmoid }]);
    const network = useMemo(() => new FeedForwardNetwork(input, ...layers, { nodes: output }), [input, layers, output]);
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
                input, output,
                layers, setLayers
            }}
        >
            {children}
        </NetworkContext.Provider>
    )
}
