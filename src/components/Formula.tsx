import { parse, EvalFunction, ConstantNode, SymbolNode } from "mathjs";
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
                    const mathNode = parse(expression);
                    mathNode.traverse(node => {
                        if (node instanceof ConstantNode && node.value === undefined)
                            node.value = 0;
                        if (node instanceof SymbolNode && node.name !== "x")
                            throw new Error("Invalid symbol: " + node.name);
                    });
                    setEval(mathNode.compile());
                } catch { }
            }}
        />
    );
}
