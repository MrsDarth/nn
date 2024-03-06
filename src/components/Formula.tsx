import { compile, EvalFunction } from "mathjs";
import { useState } from "react";

interface FormulaProps {
    setEval(evalFn: EvalFunction): void;
}

export default function Formula({ setEval }: FormulaProps) {
    const [formula, setFormula] = useState("x");
    return (
        <input
            type="text"
            className="input input-bordered w-full"
            value={formula}
            onChange={e => {
                const expression = e.target.value;
                setFormula(expression);
                try {
                    const evalFn = compile(expression);
                    evalFn.evaluate({ x: 0 });
                    setEval(evalFn);
                } catch { }
            }}
        />
    );
}
