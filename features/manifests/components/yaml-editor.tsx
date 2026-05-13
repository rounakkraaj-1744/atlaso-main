"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEditorStore } from "@/stores/editor-store";
import { PanelHeader } from "@/components/layout/panel-header";

interface YamlEditorProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function YamlEditor({ isCollapsed, onToggleCollapse }: YamlEditorProps) {
  const { resolvedTheme } = useTheme();
  const yaml = useEditorStore((state) => state.yaml);
  const setYaml = useEditorStore((state) => state.setYaml);
  const parseResult = useEditorStore((state) => state.parseResult);

  return (
    <section className="flex h-full min-h-0 flex-col bg-card/30">
      <PanelHeader 
        title="Manifest YAML" 
        status={parseResult.ok ? "valid" : "invalid"}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      {!isCollapsed && (
        <>
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
                fontSize: 12,
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                fontFamily: "var(--font-geist-mono)",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 16 },
              }}
            />
          </div>
          {!parseResult.ok && (
            <div className="border-t bg-destructive/10 px-3 py-2 text-[10px] text-destructive">
              {parseResult.line ? `Line ${parseResult.line}: ` : ""}
              {parseResult.message}
            </div>
          )}
        </>
      )}
    </section>
  );
}