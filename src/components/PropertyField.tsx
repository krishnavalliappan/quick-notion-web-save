import { PropertyFormFieldMapper } from "@/notion/utils/PropertyFormFieldMapper";
import { DatabaseProperty } from "@/notion/types/database";

export function PropertyField({ property }: { property: DatabaseProperty }) {
    const Component = PropertyFormFieldMapper(property);


  return (
    <Component
      id={property.id}
      title={property.name}
      label={property.name}
    />
  );
}
