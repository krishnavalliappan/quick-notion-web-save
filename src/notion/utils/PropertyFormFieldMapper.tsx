import { DatabaseProperty } from "@/notion/types/database";
import { Form } from "@raycast/api";

export const readablePropertyTypes = [
  "title",
  "number",
  "rich_text",
  "url",
  "email",
  "phone_number",
  "date",
  "checkbox",
  "select",
  "multi_select",
  "formula",
  "people",
  "relation",
  "status",
] as const;



export const PropertyFormFieldMapper = (property: DatabaseProperty) => {
    switch (property.type) {
        case "title":
        case "number":
        case "url":
        case "email":
        case "phone_number":
        case "formula":
            return Form.TextField;
        case "rich_text":
            return Form.TextArea;
        case "date":
            return Form.DatePicker;
        case "checkbox":
            return Form.Checkbox;
        case "select":
            return Form.Dropdown;
        case "multi_select":
        case "people":
        case "relation":
            return Form.TagPicker;
        case "status":
            return Form.Dropdown;
        // Add other cases for different property types
        default:
            return Form.TextField; // Default fallback
    }
};
