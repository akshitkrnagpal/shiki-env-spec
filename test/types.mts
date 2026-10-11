import { createHighlighter } from 'shiki';
import grammar from 'shiki-env-spec';
const highlighter = await createHighlighter({ langs: [grammar], themes: ['github-dark'] });
highlighter.codeToHtml('# @required\nTOKEN=', { lang: 'varlock', theme: 'github-dark' });
highlighter.dispose();
