import { getNotionClient } from "../oauth";
import { handleError, isNotNullOrUndefined } from "../index";

export interface Database {
  id: string;
  last_edited_time: number;
  title: string | null;
  icon_emoji: string | null;
  icon_file: string | null;
  icon_external: string | null;
}

export async function fetchDatabases() {
  try{
    const notion = getNotionClient();
  const databases = await notion.search({
    filter: {
      value: "database",
      property: "object",
    },
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });
  return databases.results
    .map((result) => (result.object === "database" && "last_edited_time" in result ? result : undefined))
    .filter(isNotNullOrUndefined)
    .map(
      (result) =>
        ({
          id: result.id,
          last_edited_time: new Date(result.last_edited_time).getTime(),
          title: result.title[0]?.plain_text,
          icon_emoji: result.icon?.type === "emoji" ? result.icon.emoji : null,
          icon_file: result.icon?.type === "file" ? result.icon.file.url : null,
          icon_external: result.icon?.type === "external" ? result.icon.external.url : null,
        }) as Database
    );
  } catch (err){
    return handleError(err, "Failed to fetch databases", [])
  }
}

export async function fetchDatabase(databaseId: string | null | undefined){
    if(!databaseId){
        return null;
    }

    try{
        const notion = getNotionClient();
        const database = await notion.databases.retrieve({
            database_id: databaseId
        });

        return database;
    } catch (err){
        handleError(err, "Error fetching database", undefined)
    }
}

