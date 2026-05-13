import yaml from "js-yaml";

export interface YamlParseSuccess {
  ok: true;
  documents: unknown[];
}

export interface YamlParseFailure {
  ok: false;
  error: {
    message: string;
    mark?: {
      line: number;
      column: number;
    };
  };
}

export type YamlParseResult = YamlParseSuccess | YamlParseFailure;

export function parseYamlDocuments(input: string): YamlParseResult {
  try {
    const documents: unknown[] = [];
    yaml.loadAll(input, (document) => {
      if (document) documents.push(document);
    });
    return { ok: true, documents };
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      return {
        ok: false,
        error: {
          message: error.reason || error.message,
          mark: error.mark
            ? { line: error.mark.line + 1, column: error.mark.column + 1 }
            : undefined,
        },
      };
    }
    return { ok: false, error: { message: "Unable to parse YAML." } };
  }
}
