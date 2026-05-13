"use server";

import { z } from "zod";
import { savePlayground } from "@/services/playgrounds/playground-repository";

const savePlaygroundSchema = z.object({
  title: z.string().min(1).max(80),
  manifestYaml: z.string().min(1),
});

export async function savePlaygroundAction(input: unknown) {
  const payload = savePlaygroundSchema.parse(input);
  return savePlayground("local-development-user", payload);
}
