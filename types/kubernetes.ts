export type KubernetesKind = "Deployment" | "Pod" | "Service" | "Node";

export type PodPhase =
  | "Pending"
  | "ContainerCreating"
  | "Running"
  | "CrashLoopBackOff"
  | "Failed"
  | "Succeeded";

export interface ObjectMeta {
  name: string;
  namespace?: string;
  labels?: Record<string, string>;
}

export interface KubernetesManifest<TSpec = unknown> {
  apiVersion: string;
  kind: KubernetesKind | string;
  metadata: ObjectMeta;
  spec?: TSpec;
}

export interface ContainerSpec {
  name: string;
  image: string;
  ports?: Array<{ containerPort: number }>;
}

export interface PodSpec {
  containers: ContainerSpec[];
  nodeName?: string;
}

export interface DeploymentSpec {
  replicas?: number;
  selector?: { matchLabels?: Record<string, string> };
  template: {
    metadata?: Pick<ObjectMeta, "labels">;
    spec: PodSpec;
  };
}

export interface ServiceSpec {
  selector?: Record<string, string>;
  ports?: Array<{
    name?: string;
    port: number;
    targetPort?: number;
    protocol?: "TCP" | "UDP";
  }>;
  type?: "ClusterIP" | "NodePort" | "LoadBalancer";
}

export interface PodResource {
  id: string;
  kind: "Pod";
  name: string;
  namespace: string;
  labels: Record<string, string>;
  ownerDeploymentName?: string;
  nodeName?: string;
  phase: PodPhase;
  restartCount: number;
  containers: ContainerSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentResource {
  id: string;
  kind: "Deployment";
  name: string;
  namespace: string;
  replicas: number;
  labels: Record<string, string>;
  selector: Record<string, string>;
  template: PodSpec;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResource {
  id: string;
  kind: "Service";
  name: string;
  namespace: string;
  labels: Record<string, string>;
  selector: Record<string, string>;
  ports: NonNullable<ServiceSpec["ports"]>;
  type: NonNullable<ServiceSpec["type"]>;
  createdAt: string;
  updatedAt: string;
}

export interface NodeResource {
  id: string;
  kind: "Node";
  name: string;
  status: "Ready" | "NotReady";
  capacity: {
    cpu: number;
    memoryMi: number;
    pods: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClusterState {
  deployments: DeploymentResource[];
  pods: PodResource[];
  services: ServiceResource[];
  nodes: NodeResource[];
  tick: number;
}

export type ClusterResource =
  | DeploymentResource
  | PodResource
  | ServiceResource
  | NodeResource;
