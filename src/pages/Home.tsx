import Controls from "../components/Controls";
import Graph from "../components/Graph";
import Visual from "../components/Visual";
import { NeuralNetProvider } from "../context/NetworkContext";

export default function BackPropagation() {
    return (
        <div className="flex p-5 gap-5">
            <div className="flex flex-wrap gap-5 w-full">
                <NeuralNetProvider>
                    <div className="bg-base-100 rounded-xl p-5 basis-full xl:basis-auto xl:order-last">
                        <Controls />
                    </div>
                    <Graph />
                    <Visual />
                </NeuralNetProvider>
            </div>
        </div>
    )
};
