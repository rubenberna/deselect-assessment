import {useEffect, useRef} from "react";

export const _useOnMount = () => {
    const mounted = useRef(false);

    const startUpCollection = async () => {
        await fetch('/api/chroma/upsert', {
            method: 'POST',
        })
    }

    useEffect(() => {
        (async () => {
            if (!mounted.current) {
                mounted.current = true;
                await startUpCollection()
            }
        })()

        return () => {
            // Perform any cleanup here
        };
    }, []);

    return mounted.current;
}