import { DatabaseProperty } from "@/notion/types/database";
import { showToast } from "@raycast/api";
import { Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

export const useFormValidation = (properties: DatabaseProperty[]) => {
    
  const { handleSubmit, itemProps } = useForm<SignUpFormValues>({
    onSubmit(values) {
      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.name} account created`,
      });
    },
    validation: {
      name: FormValidation.Required,
      password: (value) => {
        if (value && value.length < 8) {
          return "Password must be at least 8 symbols";
        } else if (!value) {
          return "The item is required";
        }
      },
    },
  });
};
