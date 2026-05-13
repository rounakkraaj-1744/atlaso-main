export interface Playground {
  id: string;
  userId: string;
  title: string;
  manifestYaml: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaygroundPayload {
  title: string;
  manifestYaml: string;
}
