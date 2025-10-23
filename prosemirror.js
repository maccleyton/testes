<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Editor Matemático Funcional</title>
    <!-- KaTeX CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" integrity="sha384-n4itNfPmZLCj9v7iUBpaKAipoBVYFNS+8qZFeTTBxJ9A/9vdWn5v0YED2P2E31144" crossorigin="anonymous">
    <!-- Estilo do editor -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prosemirror-view@1.31.1/style/prosemirror.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Editor com Fórmulas em Markdown</h1>
        <div id="editor"></div>
        <div class="instructions">
            <p>Use <code>$E=mc^2$</code> para fórmulas inline e <code>$$\\int_a^b f(x)dx$$</code> para blocos.</p>
        </div>
    </div>

    <!-- Carregamento dos scripts -->
    <script type="module">
        import { Schema, DOMSerializer } from 'https://cdn.jsdelivr.net/npm/prosemirror-model@1.21.1/+esm';
        import { EditorState } from 'https://cdn.jsdelivr.net/npm/prosemirror-state@1.5.1/+esm';
        import { EditorView } from 'https://cdn.jsdelivr.net/npm/prosemirror-view@1.31.1/+esm';
        import { keymap } from 'https://cdn.jsdelivr.net/npm/prosemirror-keymap@1.2.2/+esm';
        import { chainCommands, deleteSelection, joinBackward, selectNodeBackward } from 'https://cdn.jsdelivr.net/npm/prosemirror-commands@1.6.0/+esm';
        import { inputRules } from 'https://cdn.jsdelivr.net/npm/prosemirror-inputrules@1.3.1/+esm';
        import { mathPlugin, mathBackspaceCmd, makeInlineMathInputRule, makeBlockMathInputRule, REGEX_INLINE_MATH_DOLLARS, REGEX_BLOCK_MATH_DOLLARS } from 'https://cdn.jsdelivr.net/npm/@benrbray/prosemirror-math@1.0.10/+esm';
        import katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.11/+esm';

        // === Esquema com nós matemáticos ===
        const mathSchema = new Schema({
            nodes: {
                doc: { content: "block+" },
                paragraph: { content: "inline*", group: "block", toDOM() { return ["p", 0]; } },
                text: { group: "inline" },
                hard_break: { group: "inline", toDOM() { return ["br"]; } },
                math_inline: {
                    group: "inline math",
                    content: "text*",
                    inline: true,
                    atom: true,
                    toDOM(node) {
                        return ["span", { class: "math-node", spellcheck: "false" }, 0];
                    },
                    parseDOM: [{ tag: "span.math-node" }]
                },
                math_display: {
                    group: "block math",
                    content: "text*",
                    atom: true,
                    code: true,
                    toDOM(node) {
                        return ["div", { class: "math-node block", spellcheck: "false", style: "text-align: center; margin: 1em 0;" }, 0];
                    },
                    parseDOM: [{ tag: "div.math-node.block" }]
                }
            }
        });

        // === Regras de entrada para LaTeX com $...$ ===
        const inlineMathRule = makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, mathSchema.nodes.math_inline);
        const blockMathRule = makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, mathSchema.nodes.math_display);

        // === Plugins ===
        const plugins = [
            mathPlugin,
            keymap({
                "Backspace": chainCommands(deleteSelection, mathBackspaceCmd, joinBackward, selectNodeBackward),
                "Mod-Space": (state, dispatch) => {
                    const { $cursor } = state.selection;
                    if ($cursor) {
                        const node = mathSchema.nodes.math_inline.create({}, mathSchema.text("f(x)"));
                        const tr = state.tr.insert($cursor.pos, node);
                        dispatch?.(tr);
                        return true;
                    }
                    return false;
                }
            }),
            inputRules({ rules: [inlineMathRule, blockMathRule] })
        ];

        // === Renderização de fórmulas matemáticas ===
        const serializer = DOMSerializer.fromSchema(mathSchema);

        function renderMath(view) {
            view.dom.querySelectorAll("math-inline, math-display, span.math-node, div.math-node").forEach(elem => {
                const textContent = elem.textContent || elem.innerText;
                if (!textContent.trim()) return;

                const isBlock = elem.classList.contains("block");
                try {
                    katex.render(textContent, elem, {
                        displayMode: isBlock,
                        throwOnError: false,
                        strict: false
                    });
                } catch (e) {
                    elem.textContent = textContent;
                }
            });
        }

        // === Estado inicial do editor ===
        const state = EditorState.create({
            schema: mathSchema,
            plugins,
            doc: mathSchema.node("doc", null, [
                mathSchema.node("paragraph", null, [
                    mathSchema.text("Digite aqui. Exemplo: "),
                    mathSchema.node("math_inline", null, mathSchema.text("E = mc^2")),
                    mathSchema.text(". Use Ctrl+Espaço para inserir fórmula.")
                ])
            ])
        });

        // === Inicialização da view ===
        const view = new EditorView(document.getElementById("editor"), {
            state,
            dispatchTransaction(transaction) {
                const newState = view.state.apply(transaction);
                view.updateState(newState);
                // Renderiza novamente as fórmulas após qualquer mudança
                setTimeout(() => renderMath(view), 10);
            },
            attributes: { spellcheck: "false" }
        });

        // Renderiza as fórmulas iniciais
        setTimeout(() => renderMath(view), 100);
    </script>
</body>
</html>
