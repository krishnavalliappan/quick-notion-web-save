import { Client } from "@notionhq/client";
import { getPreferenceValues } from "@raycast/api";

const { notion_token } = getPreferenceValues<Preferences>();

// Initialize client directly with PAT
const notion = new Client({
  auth: notion_token,
});

export function getNotionClient() {
  if (!notion_token) {
    throw new Error("No Notion access token found in preferences");
  }
  
  return notion;
}