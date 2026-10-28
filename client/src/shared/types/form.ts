export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "tel" | "number";
  required: boolean;
}

export interface FormItem {
  id: string;
  name: string;
  slug: string;
  endpointUrl: string;
  enabled: boolean;
  leadCount: number;
  spamCount: number;
  createdAt: string;
  redirectUrl?: string;
  fields: FormField[];
}
