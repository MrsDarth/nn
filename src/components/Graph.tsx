import { Line, LineSegment, Point, Text, VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryPrimitiveShapeProps, VictoryScatter } from "victory";
import type { EvalFunction } from "mathjs";
import { Children, PropsWithChildren, useCallback, useId, useMemo, useState } from "react";
import Formula from "./Formula";
import { CheckToggle } from "./Toggle";

function* sampler<T>(start = 0, end = 5, step = 1, sample: (point: number) => T) {
    for (let i = start; i <= end; i += step)
        yield sample(i);
}

function ThemeLine(props: VictoryPrimitiveShapeProps) {
    delete props.style.stroke;
    return <Line {...props} className="stroke-base-content" />
}

function ThemeText(props: PropsWithChildren) {
    Children.forEach(props.children, (child: any) => delete child.props.style.fill);
    return <Text {...props} className="fill-base-content" />;
};

function ThemePoint(props: VictoryPrimitiveShapeProps) {
    delete props.style.fill;
    return <Point {...props} className="fill-base-content"/>;
}

export default function Graph() {
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
                        axisComponent={<LineSegment lineComponent={<ThemeLine />} />}
                        tickLabelComponent={<VictoryLabel textComponent={<ThemeText />} />}
                    />
                    <VictoryAxis
                        dependentAxis
                        axisComponent={<LineSegment lineComponent={<ThemeLine />} />}
                        tickLabelComponent={<VictoryLabel textComponent={<ThemeText />} />}
                    />
                    {dataVisual && (
                        <VictoryScatter
                            data={dataSample}
                            dataComponent={<ThemePoint/>}
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
