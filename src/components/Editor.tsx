import { useNeuralNet } from "../context/NetworkContext"
import { type ActivationFunction, identity, lrelu, relu, sigmoid, tanh } from "../lib/activation";
import type { LayerInit } from "../lib/ffnn";
import { MinusIcon, PlusIcon } from "./Icons";

const nameToActivation = new Map<string, ActivationFunction>()
    .set("Identity", identity)
    .set("ReLU", relu)
    .set("Leaky ReLU", lrelu)
    .set("Sigmoid", sigmoid)
    .set("Tanh", tanh);

const activationToName = new Map<ActivationFunction, string>()
    .set(identity, "Identity")
    .set(relu, "ReLU")
    .set(lrelu, "Leaky ReLU")
    .set(sigmoid, "Sigmoid")
    .set(tanh, "Tanh");

interface RangeProps {
    value: number;
    setValue(value: number): void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
};

function RangeEditor({ value, setValue, min = 0, max = 5, step = 1, disabled = false }: RangeProps) {
    return (
        <div className="flex gap-2">
            <button className="btn btn-sm btn-circle"
                disabled={disabled || value <= min}
                onClick={() => setValue(value - step)}
            >
                <MinusIcon className="w-5 h-5 stroke-current" />
            </button>
            <span>{value}</span>
            <button
                className="btn btn-sm btn-circle"
                disabled={disabled || value >= max}
                onClick={() => setValue(value + step)}
            >
                <PlusIcon className="w-5 h-5 stroke-current" />
            </button>
        </div>
    );
};

export default function Editor() {
    const { layers, setLayers, isTraining } = useNeuralNet();
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2 prose">
                <label className="text-nowrap select-none">Hidden Layers</label>
                <RangeEditor
                    disabled={isTraining}
                    value={layers.length}
                    setValue={size => {
                        if (size > layers.length) {
                            const newLayers = Array<LayerInit>(size - layers.length).fill({ nodes: 1 });
                            setLayers([...layers, ...newLayers]);
                        } else {
                            setLayers(layers.slice(0, size));
                        }
                    }}
                />
            </div>
            <div className="divider m-0" />
            <div className="flex flex-col gap-1">
                {layers.map(({ nodes, activate }, index) => {
                    const value = activate ? activationToName.get(activate) : "Identity";
                    const updateLayer = (props: Partial<LayerInit>) => setLayers(layers.map((l, i) => i === index ? { ...l, ...props } : l));
                    return (
                        <div key={index} className="flex flex-wrap lg:justify-between gap-2 prose">
                            <label className="select-none font-bold h-full">#{index + 1}</label>
                            <div className="flex items-center justify-between gap-2">
                                <label className="select-none h-full">Nodes:</label>
                                <RangeEditor
                                    disabled={isTraining}
                                    min={1}
                                    max={10}
                                    value={nodes}
                                    setValue={nodes => updateLayer({ nodes })}
                                />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <label className="select-none h-full">Activation:</label>
                                <select
                                    className="select select-sm select-bordered"
                                    disabled={isTraining}
                                    value={value}
                                    onChange={e => updateLayer({ activate: nameToActivation.get(e.target.value) })}
                                >
                                    {Array.from(nameToActivation.keys()).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="divider m-0" />
        </div>
    )
};
