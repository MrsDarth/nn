import { useCallback, useState } from "react";

export default function useRender(): [renderDep: any, render: () => void] {
  const [state, setState] = useState(0);
  const render = useCallback(() => setState((state) => state + 1), []);
  return [state, render];
}
