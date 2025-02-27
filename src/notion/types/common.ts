import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";
import { readablePropertyTypes } from "../utils/PropertyFormFieldMapper";

export type NotionSearchResponse = SearchResponse;



export type ReadablePropertyType = (typeof readablePropertyTypes)[number];