import { z } from "zod";
import type {
  ClusterState,
  DeploymentResource,
  KubernetesManifest,
  PodResource,
  ServiceResource,
} from "@/types/kubernetes";
import { parseYamlDocuments } from "@/utils/yaml";

const metadataSchema = z.object({
  name: z.string().min(1),
  namespace: z.string().optional(),
  labels: z.record(z.string(), z.string()).optional(),
});

const containerSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  ports: z.array(z.object({ containerPort: z.number() })).optional(),
});

const manifestSchema = z.object({
  apiVersion: z.string().min(1),
  kind: z.string().min(1),
  metadata: metadataSchema,
  spec: z.unknown().optional(),
});

export interface ManifestParseSuccess {
  ok: true;
  manifests: KubernetesManifest[];
}

export interface ManifestParseFailure {
  ok: false;
  message: string;
  line?: number;
  column?: number;
}

export type ManifestParseResult = ManifestParseSuccess | ManifestParseFailure;

export function parseKubernetesManifests(input: string): ManifestParseResult {
  const parsed = parseYamlDocuments(input);
  if (!parsed.ok) {
    return {
      ok: false,
      message: parsed.error.message,
      line: parsed.error.mark?.line,
      column: parsed.error.mark?.column,
    };
  }

  const manifests: KubernetesManifest[] = [];
  for (const document of parsed.documents) {
    const result = manifestSchema.safeParse(document);
    if (!result.success) {
      return {
        ok: false,
        message: result.error.issues[0]?.message ?? "Invalid Kubernetes manifest.",
      };
    }
    manifests.push(result.data as KubernetesManifest);
  }

  return { ok: true, manifests };
}

export function manifestsToClusterState(
  manifests: KubernetesManifest[],
  base: ClusterState,
): ClusterState {
  const deployments: DeploymentResource[] = [];
  const pods: PodResource[] = [];
  const services: ServiceResource[] = [];
  const now = new Date().toISOString();

  for (const manifest of manifests) {
    const namespace = manifest.metadata.namespace ?? "default";
    const labels = manifest.metadata.labels ?? {};

    if (manifest.kind === "Deployment") {
      const spec = z
        .object({
          replicas: z.number().int().min(0).default(1),
          selector: z.object({
            matchLabels: z.record(z.string(), z.string()).default({}),
          }),
          template: z.object({
            metadata: z.object({ labels: z.record(z.string(), z.string()).optional() }).optional(),
            spec: z.object({ containers: z.array(containerSchema).min(1) }),
          }),
        })
        .parse(manifest.spec);

      deployments.push({
        id: `${namespace}:deployment:${manifest.metadata.name}`,
        kind: "Deployment",
        name: manifest.metadata.name,
        namespace,
        replicas: spec.replicas,
        labels,
        selector:
          Object.keys(spec.selector.matchLabels).length > 0
            ? spec.selector.matchLabels
            : (spec.template.metadata?.labels ?? labels),
        template: spec.template.spec,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (manifest.kind === "Pod") {
      const spec = z.object({ containers: z.array(containerSchema).min(1) }).parse(manifest.spec);
      pods.push({
        id: `${namespace}:pod:${manifest.metadata.name}`,
        kind: "Pod",
        name: manifest.metadata.name,
        namespace,
        labels,
        phase: "Pending",
        restartCount: 0,
        containers: spec.containers,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (manifest.kind === "Service") {
      const spec = z
        .object({
          selector: z.record(z.string(), z.string()).default({}),
          ports: z
            .array(
              z.object({
                name: z.string().optional(),
                port: z.number(),
                targetPort: z.number().optional(),
                protocol: z.enum(["TCP", "UDP"]).default("TCP"),
              }),
            )
            .default([]),
          type: z.enum(["ClusterIP", "NodePort", "LoadBalancer"]).default("ClusterIP"),
        })
        .parse(manifest.spec);

      services.push({
        id: `${namespace}:service:${manifest.metadata.name}`,
        kind: "Service",
        name: manifest.metadata.name,
        namespace,
        labels,
        selector: spec.selector,
        ports: spec.ports,
        type: spec.type,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return {
    ...base,
    deployments,
    pods,
    services,
  };
}
