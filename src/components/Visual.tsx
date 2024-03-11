import type { ReactNode } from "react";
import { Point, VictoryContainer, VictoryGroup, VictoryLine, VictoryScatter } from "victory";
import { useNeuralNet } from "../context/NetworkContext";
import { tanh } from "../lib/activation";
import Editor from "./Editor";

interface Point {
    x: number;
    y: number;
}

export default function Visual() {
    const { input, network } = useNeuralNet();
    const points: Point[] = [];
    const lines: ReactNode[] = [];
    for (let i = 0; i < input; i++)
        points.push({ x: 0, y: (i + 1) / (input + 1) });
    network.layers.forEach((layer, layerIndex) => {
        const pointOffset = points.length;
        layer.nodes.forEach((node, nodeIndex, { length: nodesLength }) => {
            const point: Point = { x: layerIndex + 1, y: (nodeIndex + 1) / (nodesLength + 1) };
            node.weights.forEach((weight, weightIndex, { length: weightsLength }) => {
                const inputPoint = points[pointOffset - weightsLength + weightIndex];
                const baseColor = weight > 0 ? "#0000ff" : "#ff0000";
                const opacity = Math.round(tanh.forward(Math.abs(weight)) * 0xFF);
                const color = baseColor + opacity.toString(16).padStart(2, "0");
                lines.push(
                    <VictoryLine
                        key={lines.length}
                        data={[inputPoint, point]}
                        style={{ data: { stroke: color } }}
                    />
                );
            });
            points.push(point);
        });
    });
    return (
        <div className="bg-base-100 rounded-xl p-5 flex-1">
            <Editor />
            <div>
                <VictoryGroup
                    padding={10}
                    containerComponent={<VictoryContainer className="[&_svg]:!pointer-events-none" />}
                >
                    {lines}
                    <VictoryScatter
                        data={points}
                        size={10}
                        dataComponent={<Point className="!fill-base-content" />}
                    />
                </VictoryGroup>
            </div>
        </div>
    );
};
