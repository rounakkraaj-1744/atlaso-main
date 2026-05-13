"use client";

import Editor from "@monaco-editor/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/stores/editor-store";

export function YamlEditor() {
  const { resolvedTheme } = useTheme();
  const yaml = useEditorStore((state) => state.yaml);
  const setYaml = useEditorStore((state) => state.setYaml);
  const parseResult = useEditorStore((state) => state.parseResult);

  return (
    <section className="flex min-h-0 flex-col border-r bg-card">
      <div className="flex h-11 items-center justify-between border-b px-3">
        <div>
          <h2 className="text-sm font-semibold">Manifest YAML</h2>
          <p className="text-xs text-muted-foreground">Multi-document input</p>
        </div>
        {parseResult.ok ? (
          <Badge className="border-primary/30 text-primary">
            <CheckCircle2 className="mr-1 size-3" />
            Valid
          </Badge>
        ) : (
          <Badge className="border-destructive/40 text-destructive">
            <AlertTriangle className="mr-1 size-3" />
            Invalid
          </Badge>
        )}
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          defaultLanguage="yaml"
          height="100%"
          language="yaml"
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          value={yaml}
          onChange={(value) => setYaml(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-geist-mono)",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>
      {!parseResult.ok && (
        <div className="border-t bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {parseResult.line ? `Line ${parseResult.line}: ` : ""}
          {parseResult.message}
        </div>
      )}
    </section>
  );
}
