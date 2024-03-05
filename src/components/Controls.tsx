import { useState } from "react";

export default function Controls() {
    const [training, setTraining] = useState(false);
    return (
        <div className="flex flex-col bg-base-100 rounded-xl p-5 gap-2">
            {training ? (
                <button className="btn btn-error" onClick={() => setTraining(false)}>Stop</button>
            ) : (
                <button className="btn btn-primary" onClick={() => setTraining(true)}>Train</button>
            )}
            <div className="flex items-center justify-between gap-2 prose">
                <label className="text-nowrap select-none">Learn Rate</label>
                <input type="number" className="input input-sm input-bordered"/>
            </div>
            <div className="flex items-center justify-between gap-2 prose">
                <label className="text-nowrap select-none">Iterations per frame</label>
                <input type="number" className="input input-sm input-bordered"/>
            </div>
        </div>
    )
};
