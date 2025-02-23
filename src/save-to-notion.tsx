import React, { useState, useEffect } from "react";
import { BrowserExtension } from "@raycast/api";
import extractAndConvertToMarkdown from "./browserUtils/htmlToMarkdown";
import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { MarkdownResult} from "./browserUtils/htmlToMarkdown";
import { getNotionClient } from "./notion/oauth";

interface SignUpFormValues {
  name: string;
  password: string;
  extractedContent: string;
}


export default function Command() {
  const notion = getNotionClient();
  const [extractedContent, setExtractedContent] = useState<MarkdownResult | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Get both HTML and markdown content concurrently
        const [html, markdown] = await Promise.all([
          BrowserExtension.getContent({ format: "html" }),
          BrowserExtension.getContent({ format: "markdown" }),
        ]);

        // Extract and convert the content with your helper function
        const result = await extractAndConvertToMarkdown(html, markdown);

        // Save the result in state
        setExtractedContent(result);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    })();
  }, []);

  const { handleSubmit, itemProps } = useForm<SignUpFormValues>({
    onSubmit(values) {
      if (extractedContent) {
        showToast({
          style: Toast.Style.Success,
          title: "Success!",
          message: `${values.name} account created. Value: ${extractedContent.formattedContent}`,
        });
      }
    },
    validation: {
      name: FormValidation.Required,
      password: (value) => {
        if (!value) {
          return "Password is required";
        } else if (value.length < 8) {
          return "Password must be at least 8 symbols";
        }
      },
    },
  });

  // While the asynchronous operations are in flight, show a loading state.
  if (!extractedContent) {
    return <Form isLoading />;
  }

  // Once the asynchronous work is done, render the form with the extracted data.
  return (
    <>
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Title"
        placeholder="Enter a title"
        defaultValue={extractedContent.title}
        {...itemProps.name}
      />
      <Form.PasswordField title="New Password" {...itemProps.password} />
      <Form.TextArea title="Extracted Content" defaultValue={extractedContent.formattedContent} id="extractedContent" />
    </Form>
    </>
  );
}