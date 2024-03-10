import { LineSegment, Point, TSpan, VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryScatter } from "victory";
import { type EvalFunction } from "mathjs";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Formula from "./Formula";
import { CheckToggle } from "./Toggle";
import { useNeuralNet } from "../context/NetworkContext";

function sample<T>(start = 0, end = 5, step = 1, sample: (point: number) => T) {
    const results = Array<T>(Math.ceil((end - start) / step));
    for (let i = start, index = 0; i <= end; i += step)
        results[index++] = sample(i);
    return results;
}

export default function Graph() {
    const { forward, setTrainingData } = useNeuralNet();

    const [evalFn, setEvalFn] = useState<EvalFunction>(() => ({ evaluate: ({ x }) => x }));

    const start = -2, end = 10, padding = 2;
    const min = -100, max = 100;
    const sampleDataPoint = useCallback((x: number) => {
        const result = evalFn.evaluate({ x });
        return { x, y: isNaN(result) ? 0 : Math.min(Math.max(result, min), max) };
    }, [evalFn]);
    
    const lineSample = useMemo(() => sample(start, end, 0.01, sampleDataPoint), [sampleDataPoint]);
    const dataSample = useMemo(() => sample(start + padding, end - padding, 1, sampleDataPoint), [sampleDataPoint]);
    const netSample = useMemo(() => sample(start, end, 0.01, x => ({ x, y: forward([x])[0] })), [forward]);

    const dataId = useId();
    const lineId = useId();
    const [dataVisual, setDataVisual] = useState(true);
    const [lineVisual, setLineVisual] = useState(true);

    useEffect(() => {
        setTrainingData(dataSample.map(({ x, y }) => ({ inputs: [x], expected: [y] })));
    }, [dataSample]);
    return (
        <div className="bg-base-100 rounded-xl p-5 flex-1 min-w-[300px]">
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
                        tickLabelComponent={<VictoryLabel tspanComponent={<TSpan className="!fill-base-content" />} />}
                    />
                    <VictoryAxis
                        dependentAxis
                        axisComponent={<LineSegment className="!stroke-base-content" />}
                        tickLabelComponent={<VictoryLabel tspanComponent={<TSpan className="!fill-base-content" />} />}
                    />
                    <VictoryLine
                        data={netSample}
                        style={{ data: { stroke: "red" } }}
                    />
                    {lineVisual && (
                        <VictoryLine
                            data={lineSample}
                            style={{ data: { stroke: "blue" } }}
                        />
                    )}
                    {dataVisual && (
                        <VictoryScatter
                            data={dataSample}
                            dataComponent={<Point className="!fill-base-content" />}
                        />
                    )}
                </VictoryChart>
            </div>
        </div>
    );
};
