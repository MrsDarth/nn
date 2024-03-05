import { useCallback, useState } from "react";

export default function useRender() {
    const [,setState] = useState(0);
    return useCallback(() => setState(state => state + 1), []);
}
