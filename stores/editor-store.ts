import { create } from "zustand";
import { SAMPLE_MANIFEST } from "@/constants/sample-manifests";
import type { ManifestParseResult } from "@/utils/kubernetes-manifest";
import { parseKubernetesManifests } from "@/utils/kubernetes-manifest";

interface EditorStore {
  yaml: string;
  parseResult: ManifestParseResult;
  setYaml: (yaml: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  yaml: SAMPLE_MANIFEST,
  parseResult: parseKubernetesManifests(SAMPLE_MANIFEST),
  setYaml: (yaml) =>
    set({
      yaml,
      parseResult: parseKubernetesManifests(yaml),
    }),
}));
