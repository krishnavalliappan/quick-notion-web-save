import { Detail } from "@raycast/api";
import { useDatabase, useDatabases } from "./hooks/useDatabases";

export default function Command() {
    const {data: databases, isLoading} = useDatabases();
    const databaseId = databases?.[0]?.id;
    const {data: database, isLoading: isDatabaseLoading} = useDatabase(databaseId);


  return <Detail 
  isLoading={isLoading || isDatabaseLoading} 
  markdown={`${JSON.stringify(database)}`} />;
}
