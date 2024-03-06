import { useEffect, useState } from "react";
import { useNeuralNet } from "../context/NetworkContext";
import { Perceptron } from "../lib/ffnn";

export default function Controls() {
    const [training, setTraining] = useState(false);
    const [iterations, setIterations] = useState(50);
    const { train } = useNeuralNet();
    useEffect(() => {
        if (!training) return;
        const handle = requestAnimationFrame(() => train(iterations));
        return () => cancelAnimationFrame(handle);
    })
    return (
        <div className="flex flex-col gap-2">
            {training ? (
                <button className="btn btn-error" onClick={() => setTraining(false)}>Stop</button>
            ) : (
                <button className="btn btn-primary" onClick={() => setTraining(true)}>Train</button>
            )}
            <div className="flex items-center justify-between gap-2 prose">
                <label className="text-nowrap select-none">Learn Rate</label>
                <input
                    type="number"
                    className="input input-sm input-bordered"
                    disabled={training}
                    min={0}
                    max={1}
                    step={0.001}
                    defaultValue={Perceptron.learnRate}
                    onChange={e => Perceptron.learnRate = e.target.valueAsNumber}
                />
            </div>
            <div className="flex items-center justify-between gap-2 prose">
                <label className="text-nowrap select-none">Iterations</label>
                <input
                    type="number"
                    className="input input-sm input-bordered"
                    disabled={training}
                    min={1}
                    value={iterations}
                    onChange={e => setIterations(e.target.valueAsNumber)}
                />
            </div>
        </div>
    )
};
