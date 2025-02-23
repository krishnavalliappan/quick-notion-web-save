import { useCachedPromise } from "@raycast/utils";
import { fetchDatabase, fetchDatabases } from "../notion/api/databases";

export function useDatabases(){
    const result = useCachedPromise(()=>fetchDatabases());

    return result
}

export function useDatabase(databaseId: string | null | undefined){

    const result = useCachedPromise(()=>fetchDatabase(databaseId));

    return result
}