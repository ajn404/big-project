import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Monaco Editor 实例接口
export interface MonacoEditorHandle {
  insertText: (text: string) => void;
  insertAtNewLine: (text: string) => void;
  getSelectedText: () => string;
  replaceSelection: (text: string) => void;
  focus: () => void;
  getEditor: () => monaco.editor.IStandaloneCodeEditor | null;
  getValue: () => string;
  setValue: (value: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

interface MonacoMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string | number;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  onSelectionChange?: (selection: monaco.Selection) => void;
}

const MonacoMarkdownEditor = forwardRef<MonacoEditorHandle, MonacoMarkdownEditorProps>(({
  value,
  onChange,
  placeholder = 'Start writing...',
  height = 500,
  theme = 'light',
  readOnly = false,
  onMount,
  onSelectionChange,
}, ref) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('insert-text', [{
          range: new monaco.Range(
            selection.startLineNumber,
            selection.startColumn,
            selection.endLineNumber,
            selection.endColumn
          ),
          text,
          forceMoveMarkers: true,
        }]);

        // 移动光标到插入文本的末尾
        const newPosition = {
          lineNumber: selection.startLineNumber,
          column: selection.startColumn + text.length,
        };
        editor.setPosition(newPosition);
        editor.focus();
      }
    },

    insertAtNewLine: (text: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      const position = editor.getPosition();
      if (position) {
        const model = editor.getModel();
        if (model) {
          const lineContent = model.getLineContent(position.lineNumber);
          const isLineEmpty = lineContent.trim() === '';

          let insertText = text;
          if (!isLineEmpty) {
            insertText = '\n' + text;
          }

          editor.executeEdits('insert-at-new-line', [{
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: insertText,
            forceMoveMarkers: true,
          }]);

          editor.focus();
        }
      }
    },

    getSelectedText: () => {
      const editor = editorRef.current;
      if (!editor) return '';

      const selection = editor.getSelection();
      if (selection) {
        const model = editor.getModel();
        return model?.getValueInRange(selection) || '';
      }
      return '';
    },

    replaceSelection: (text: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('replace-selection', [{
          range: selection,
          text,
          forceMoveMarkers: true,
        }]);
        editor.focus();
      }
    },

    focus: () => {
      editorRef.current?.focus();
    },

    getEditor: () => editorRef.current,

    getValue: () => {
      return editorRef.current?.getValue() || '';
    },

    setValue: (value: string) => {
      editorRef.current?.setValue(value);
    },

    undo: () => {
      editorRef.current?.trigger('keyboard', 'undo', null);
    },

    redo: () => {
      editorRef.current?.trigger('keyboard', 'redo', null);
    },

    canUndo: () => {
      // Monaco Editor 的撤销/重做状态需要通过其他方式检查
      // 这里简化为总是返回 true，让父组件处理具体逻辑
      return true;
    },

    canRedo: () => {
      // Monaco Editor 的撤销/重做状态需要通过其他方式检查
      // 这里简化为总是返回 true，让父组件处理具体逻辑
      return true;
    },
  }));

  // 配置 Monaco Editor
  const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // 配置 Markdown 语言支持
    monaco.languages.setLanguageConfiguration('markdown', {
      wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
      comments: {
        blockComment: ['<!--', '-->']
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>', notIn: ['string'] },
        { open: '`', close: '`' },
        { open: '**', close: '**' },
        { open: '*', close: '*' },
        { open: '_', close: '_' }
      ],
      surroundingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '`', close: '`' },
        { open: '**', close: '**' },
        { open: '*', close: '*' },
        { open: '_', close: '_' }
      ],
      folding: {
        markers: {
          start: new RegExp('^\\s*<!--\\s*#?region\\b.*-->'),
          end: new RegExp('^\\s*<!--\\s*#?endregion\\b.*-->')
        }
      }
    });

    // 添加自定义主题
    monaco.editor.defineTheme('markdown-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000' },
        { token: 'string.md', foreground: '0451A5' },
        { token: 'keyword.md', foreground: 'AF00DB' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#0969da',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editor.selectionBackground': '#0969da20',
      }
    });

    monaco.editor.defineTheme('markdown-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'string.md', foreground: '9CDCFE' },
        { token: 'keyword.md', foreground: 'C586C0' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#f0f6fc',
        'editorLineNumber.foreground': '#7d8590',
        'editor.lineHighlightBackground': '#21262d',
        'editor.selectionBackground': '#388bfd26',
      }
    });

    // 设置编辑器配置
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'Cascadia Code', 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace",
      fontLigatures: true,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      lineNumbers: 'off',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggest: {
        showWords: false,
        showSnippets: true,
      },
      acceptSuggestionOnEnter: 'on',
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
    });

    // 添加键盘快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      const selection = editor.getSelection();
      if (selection) {
        const selectedText = editor.getModel()?.getValueInRange(selection) || '';
        const boldText = `**${selectedText}**`;
        editor.executeEdits('bold', [{
          range: selection,
          text: boldText,
          forceMoveMarkers: true,
        }]);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      const selection = editor.getSelection();
      if (selection) {
        const selectedText = editor.getModel()?.getValueInRange(selection) || '';
        const italicText = `*${selectedText}*`;
        editor.executeEdits('italic', [{
          range: selection,
          text: italicText,
          forceMoveMarkers: true,
        }]);
      }
    });

    // 监听选择变化
    editor.onDidChangeCursorSelection((e) => {
      onSelectionChange?.(e.selection);
    });

    // 监听内容变化 - 已通过 Editor 组件的 onChange prop 处理
    // editor.onDidChangeModelContent(() => {
    //   const currentValue = editor.getValue();
    //   // 确保内容变化时立即通知父组件
    //   if (currentValue !== value) {
    //     onChange(currentValue);
    //   }
    // });

    // 添加自定义代码片段
    monaco.languages.registerCompletionItemProvider('markdown', {
      provideCompletionItems: (_, position) => {
        // 获取当前位置的范围用于插入
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column
        };

        const suggestions = [
          {
            label: 'link',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '[${1:text}](${2:url})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Insert a markdown link',
            range: range
          },
          {
            label: 'image',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '![${1:alt text}](${2:image url})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Insert a markdown image',
            range: range
          },
          {
            label: 'code',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '```${1:javascript}\n${2:code}\n```',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Insert a code block',
            range: range
          },
          {
            label: 'table',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '| ${1:Header 1} | ${2:Header 2} |\n|----------|----------|\n| ${3:Cell 1} | ${4:Cell 2} |',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Insert a markdown table',
            range: range
          },
          {
            label: 'quote',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '> ${1:quote text}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Insert a quote',
            range: range
          }
        ];

        return { suggestions };
      }
    });

    // 设置初始内容
    if (value) {
      editor.setValue(value);
    } else if (placeholder) {
      // 如果有占位符且内容为空，显示占位符
      editor.setValue(`<!-- ${placeholder} -->`);
      editor.setPosition({ lineNumber: 1, column: 1 });
      editor.getModel()?.pushEditOperations([], [{
        range: editor.getModel()?.getFullModelRange()!,
        text: '',
        forceMoveMarkers: true
      }], () => null);
    }

    // 设置初始主题
    const initialTheme = theme === 'dark' ? 'markdown-dark' : 'markdown-light';
    monaco.editor.setTheme(initialTheme);

    // 调用外部 onMount 回调
    onMount?.(editor, monaco);
  }, [onChange, onMount, onSelectionChange, placeholder, value]);

  // 同步外部 value 到编辑器
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (value !== currentValue) {
        // 保存光标位置
        const position = editorRef.current.getPosition();
        editorRef.current.setValue(value);
        // 恢复光标位置
        if (position) {
          editorRef.current.setPosition(position);
        }
      }
    }
  }, [value]);

  // 主题切换效果
  useEffect(() => {
    console.log(theme, 'theme', monacoRef.current, editorRef.current)
    if (monacoRef.current && editorRef.current) {
      const themeToApply = theme === 'dark' ? 'markdown-dark' : 'markdown-light';
      monacoRef.current.editor.setTheme(themeToApply);
    }
  }, [theme]);

  return (
    <div className="monaco-markdown-editor h-full">
      <Editor
        height={height}
        language="markdown"
        value={value}
        onChange={(newValue) => {
          // 直接在这里处理内容变化，确保实时响应
          if (newValue && newValue !== value) {
            onChange(newValue);
          }
        }}
        onMount={handleEditorMount}
        theme={theme === 'dark' ? 'markdown-dark' : 'markdown-light'}
        options={{
          readOnly,
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  );
});

MonacoMarkdownEditor.displayName = 'MonacoMarkdownEditor';

export default MonacoMarkdownEditor;