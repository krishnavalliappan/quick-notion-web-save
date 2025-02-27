import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionSearchResponse = SearchResponse;


export const readablePropertyTypes = ["title", "number", "rich_text", "url", "email", "phone_number", "date", "checkbox", "select", "multi_select", "formula", "people", "relation", "status"] as const;
export type ReadablePropertyType = (typeof readablePropertyTypes)[number];