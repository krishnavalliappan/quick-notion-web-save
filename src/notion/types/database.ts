import { Standardized } from "@/notion/utils/standardize";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export interface Database {
  id: string;
  last_edited_time: number;
  title: string | null;
  icon: string | null;
}

export interface IconObject {
  type: "emoji" | "file" | "external";
  emoji?: string;
  file?: { url: string };
  external?: { url: string };
}

export type DatabaseObject = GetDatabaseResponse;

export type DatabasePropertyObject = DatabaseObject["properties"];

export type DatabaseProperty = Standardized<DatabasePropertyObject[string], "config">;
