import useSWR from "swr";
import {fetcher} from "@/src/lib/utils/functions";

export const _useOnMount = () => {
  const {data: count, isLoading: isLoadingCount, isValidating} = useSWR('/api/getCount', fetcher)
  const {isLoading} = useSWR(!isLoadingCount && count < 1 ? '/api/loadPdf' : null, fetcher)
  return {
    isLoadingPdf: isLoading,
  }
}