"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface TemplateEditorProps {
  templateId: string;
  clientId: string;
  apiEndpoint: string;
}

declare global {
  interface Window {
    TemplateEditor: {
      init: (opts: { templateId: string; clientId: string; apiEndpoint: string }) => void;
      getData: () => Record<string, unknown>;
      setData: (data: Record<string, unknown>) => void;
      destroy: () => void;
    };
  }
}

export default function TemplateEditor({ templateId, clientId, apiEndpoint }: TemplateEditorProps) {
  const initialized = useRef(false);

  useEffect(() => {
    return () => {
      if (initialized.current && window.TemplateEditor) {
        window.TemplateEditor.destroy();
        initialized.current = false;
      }
    };
  }, []);

  const handleScriptLoad = () => {
    if (!initialized.current && window.TemplateEditor) {
      window.TemplateEditor.init({
        templateId,
        clientId,
        apiEndpoint,
      });
      initialized.current = true;
    }
  };

  return (
    <Script
      src="/template-editor.js"
      strategy="lazyOnload"
      onLoad={handleScriptLoad}
    />
  );
}
