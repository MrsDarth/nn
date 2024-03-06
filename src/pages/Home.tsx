import Graph from "../components/Graph";
import Visual from "../components/Visual";
import { NeuralNetProvider } from "../context/NetworkContext";

export default function Home() {
    return (
        <div className="flex p-5 gap-5">
            <div className="flex gap-5 w-full">
                <NeuralNetProvider>
                    <Graph />
                    <Visual />
                </NeuralNetProvider>
            </div>
        </div>
    )
};
