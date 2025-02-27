import { getNotionClient } from "@/notion/client";
import { tranformDatabaseObject, transformDatabase } from "@/notion/api/databases/transform";
import { handleError } from "@/notion/utils/error";

export async function fetchDatabases() {
  try {
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
    return transformDatabase(databases);
  } catch (err) {
    return handleError(err, "Failed to fetch databases", []);
  }
}

export async function fetchDatabase(databaseId: string | null | undefined) {
  if (!databaseId) {
    return undefined;
  }

  try {
    const notion = getNotionClient();
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    return tranformDatabaseObject(database);
  } catch (err) {
    handleError(err, "Error fetching database", undefined);
  }
}
