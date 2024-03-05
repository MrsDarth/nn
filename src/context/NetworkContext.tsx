import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import FeedForwardNetwork, { LayerInit } from "../lib/ffnn";
import useRender from "../hooks/render";

interface NeuralNetContext {
    network: FeedForwardNetwork;
    render(): void;

    input: number;
    setInput(input: number): void;
    layers: LayerInit[];
    setLayers(layers: LayerInit[]): void;
}

const NetworkContext = createContext<NeuralNetContext>(null!);

export const useNeuralNet = () => useContext(NetworkContext);

export function NeuralNetProvider({ children }: PropsWithChildren) {
    const [input, setInput] = useState(1);
    const [layers, setLayers] = useState<LayerInit[]>(() => [{ nodes: 1 }]);
    const network = useMemo(() => new FeedForwardNetwork(input, ...layers), [input, layers]);
    const render = useRender();
    return (
        <NetworkContext.Provider value={{ network, render, input, setInput, layers, setLayers }}>
            {children}
        </NetworkContext.Provider>
    )
}
