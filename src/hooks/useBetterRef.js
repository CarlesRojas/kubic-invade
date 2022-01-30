import { useRef } from "react";

export default function useBetterRef(initialValue) {
    const value = useRef(initialValue);

    const getValue = () => {
        return value.current;
    };

    const setValue = (newValue) => {
        value.current = newValue;
    };

    return [getValue, setValue];
}
