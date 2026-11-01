import type { Form } from "@prisma/client";
import type { z } from "zod";
import { FIELD_TYPES } from "../shared/constants";
import { createFormSchema, formFieldSchema, updateFormSchema } from "./forms.validation";

export type FieldType = (typeof FIELD_TYPES)[number];
export type FormFieldInput = z.infer<typeof formFieldSchema>;
export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
export type FormRecord = Form;
