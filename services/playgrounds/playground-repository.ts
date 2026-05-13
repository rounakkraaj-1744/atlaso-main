import { nanoid } from "nanoid";
import type { Playground, PlaygroundPayload } from "@/types/playgrounds";

const memoryPlaygrounds = new Map<string, Playground>();

export async function savePlayground( userId: string, payload: PlaygroundPayload ): Promise<Playground> {
  const now = new Date().toISOString();
  const playground: Playground = {
    id: nanoid(),
    userId,
    title: payload.title,
    manifestYaml: payload.manifestYaml,
    createdAt: now,
    updatedAt: now,
  };
  memoryPlaygrounds.set(playground.id, playground);
  return playground;
}

export async function listPlaygrounds(userId: string): Promise<Playground[]> {
  return [...memoryPlaygrounds.values()].filter(
    (playground) => playground.userId === userId,
  );
}