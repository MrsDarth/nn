import { LineSegment, Point, TSpan, VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryScatter } from "victory";
import type { EvalFunction } from "mathjs";
import { useCallback, useId, useMemo, useState } from "react";
import Formula from "./Formula";
import { CheckToggle } from "./Toggle";
import { useNeuralNet } from "../context/NetworkContext";

function* sampler<T>(start = 0, end = 5, step = 1, sample: (point: number) => T) {
    for (let i = start; i <= end; i += step)
        yield sample(i);
}

export default function Graph() {
    const { network } = useNeuralNet();

    const start = -2, end = 10, padding = 2;
    const [evalFn, setEvalFn] = useState<EvalFunction>(() => ({ evaluate: ({ x }) => x }));
    const sampleDataPoint = useCallback((x: number) => ({ x, y: evalFn.evaluate({ x }) }), [evalFn]);
    const lineSample = useMemo(() => [...sampler(start, end, 0.01, sampleDataPoint)], [sampleDataPoint]);
    const dataSample = useMemo(() => [...sampler(start + padding, end - padding, 1, sampleDataPoint)], [sampleDataPoint]);

    const dataId = useId();
    const lineId = useId();
    const [dataVisual, setDataVisual] = useState(true);
    const [lineVisual, setLineVisual] = useState(true);
    return (
        <div className="bg-base-100 rounded-xl p-5 flex-1 max-w-[700px]">
            <div className="flex flex-col p-2 gap-2">
                <div className="flex items-center gap-2 prose">
                    <label className="text-nowrap select-none">Graph Function</label>
                    <Formula setEval={setEvalFn} />
                </div>
                <div className="flex items-center gap-2 prose">
                    <CheckToggle id={dataId} value={dataVisual} setValue={setDataVisual} />
                    <label htmlFor={dataId} className="text-nowrap select-none">Data Points</label>
                </div>
                <div className="flex items-center gap-2 prose">
                    <CheckToggle id={lineId} value={lineVisual} setValue={setLineVisual} />
                    <label htmlFor={lineId} className="text-nowrap select-none">Line</label>
                </div>
            </div>
            <div>
                <VictoryChart domain={[start, end]} padding={20}>
                    <VictoryAxis
                        axisComponent={<LineSegment className="!stroke-base-content" />}
                        tickLabelComponent={<VictoryLabel tspanComponent={<TSpan className="!fill-base-content"/>} />}
                    />
                    <VictoryAxis
                        dependentAxis
                        axisComponent={<LineSegment className="!stroke-base-content" />}
                        tickLabelComponent={<VictoryLabel tspanComponent={<TSpan className="!fill-base-content"/>} />}
                    />
                    <VictoryLine
                        samples={120}
                        y={({ x }) => network.forward([ x ])[0]}
                        style={{ data: { stroke: "red" } }}
                    />
                    {dataVisual && (
                        <VictoryScatter
                            data={dataSample}
                            dataComponent={<Point className="!fill-base-content"/>}
                        />
                    )}
                    {lineVisual && (
                        <VictoryLine
                            data={lineSample}
                            style={{ data: { stroke: "blue" } }}
                        />
                    )}
                </VictoryChart>
            </div>
        </div>
    );
};
