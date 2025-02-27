import { standardize } from "@/notion/utils/standardize";
import { isNotNullOrUndefined, isReadableProperty } from "@/notion/utils/validators";
import { DatabaseObject, DatabasePropertyObject, DatabaseProperty } from "@/notion/types/database";
import { NotionSearchResponse } from "@/notion/types/common";
import { Database, IconObject } from "@/notion/types/database";


function iconTransform(iconObject: IconObject | null) {
  if (!iconObject) {
    return null;
  }

  if (iconObject.type === "emoji") {
    return iconObject.emoji;
  }

  if (iconObject.type === "file" && iconObject.file) {
    return iconObject.file.url;
  }

  if (iconObject.type === "external" && iconObject.external) {
    return iconObject.external.url;
  }

  return null;
}


export function transformDatabase(databases: NotionSearchResponse) {
  return databases.results
      .map((result) => (result.object === "database" && "last_edited_time" in result ? result : undefined))
      .filter(isNotNullOrUndefined)
      .map(
        (result) =>
          ({
            id: result.id,
            last_edited_time: new Date(result.last_edited_time).getTime(),
            title: result.title[0]?.plain_text,
            icon: iconTransform(result.icon as IconObject),
          }) as Database
      );
}

export function tranformDatabaseObject(databaseObject: DatabaseObject) {
  const transformedDatabaseObject = {
    ...databaseObject,
    created_by:
      "created_by" in databaseObject && databaseObject.created_by.object === "user"
        ? databaseObject.created_by.id
        : undefined,
    last_edited_time:
      "last_edited_time" in databaseObject ? new Date(databaseObject.last_edited_time).getTime() : undefined,
    last_edited_by:
      "last_edited_by" in databaseObject && databaseObject.last_edited_by.object === "user"
        ? databaseObject.last_edited_by.id
        : undefined,
    parent_page_id:
      "parent" in databaseObject && databaseObject.parent.type === "page_id"
        ? databaseObject.parent.page_id
        : undefined,
    parent_database_id:
      "parent" in databaseObject && databaseObject.parent.type === "database_id"
        ? databaseObject.parent.database_id
        : undefined,
    title: "title" in databaseObject ? databaseObject.title[0]?.plain_text : undefined,
    description: "description" in databaseObject ? databaseObject.description[0]?.plain_text : undefined,
    icon: iconTransform("icon" in databaseObject? databaseObject.icon as IconObject : null),
    icon_emoji: "icon" in databaseObject && databaseObject.icon?.type === "emoji" ? databaseObject.icon.emoji : null,
    icon_file: "icon" in databaseObject && databaseObject.icon?.type === "file" ? databaseObject.icon.file.url : null,
    icon_external:
      "icon" in databaseObject && databaseObject.icon?.type === "external" ? databaseObject.icon.external.url : null,
    url: "url" in databaseObject ? databaseObject.url : undefined,
    database_properties: transformDatabasePropertyObject(databaseObject.properties),
  };

  return transformedDatabaseObject;
}

export function transformDatabasePropertyObject(databasePropertyObject: DatabasePropertyObject) {
  const propertyNames = Object.keys(databasePropertyObject);

  const databaseProperties: DatabaseProperty[] = [];

  propertyNames.forEach((propertyName) => {
    const property = databasePropertyObject[propertyName];
    if (isReadableProperty(property)) {
      if (property.type == "select")
        property.select.options.unshift({
          id: "_select_null_",
          name: "No Selection",
          color: "default",
          description: "No selection",
        });
      databaseProperties.push(standardize(property, "config"));
    }
  });

  return databaseProperties;
}
