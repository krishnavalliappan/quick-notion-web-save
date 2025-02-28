import { Form } from "@raycast/api";
import { useDatabase, useDatabases } from "@/hooks/useDatabases";
import { useState } from "react";
import { PropertyField } from "@/components/PropertyField";
export default function Command() {
  const { data: databases, isLoading } = useDatabases();
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | undefined>(databases?.[0]?.id);
  const { data: database, isLoading: isDatabaseLoading } = useDatabase(selectedDatabaseId);

  console.log(database?.database_properties);

  return (
    <Form >
      <Form.Dropdown
        isLoading={isLoading}
        id="database"
        title="Database"
        onChange={(value) => {
          setSelectedDatabaseId(value);
        }}
        value={selectedDatabaseId}
        autoFocus
        info="Select a database to save captured content."
      >
        {databases?.map((db) => (
          <Form.Dropdown.Item
            key={db.id}
            value={db.id}
            icon={db?.icon || undefined}
            title={db.title ?? ""}
          />
        ))}
      </Form.Dropdown>
      {database?.database_properties.map((property) => (
        <PropertyField key={property.id} property={property} />
      ))}
    </Form>
  );
}
