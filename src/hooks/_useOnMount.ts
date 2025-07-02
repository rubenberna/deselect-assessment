import {useEffect, useRef} from "react";

export const _useOnMount = () => {
    const mounted = useRef(false);

    const startUpCollection = async () => {
        const startTime = performance.now()
        await fetch('/api/chroma/loadDataSource', {
            method: 'POST',
        })
        const endTime = performance.now()
        const minutes = (endTime - startTime) / (1000 * 60);

        console.log(`Call to load pdf took ${minutes} minutes`);
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