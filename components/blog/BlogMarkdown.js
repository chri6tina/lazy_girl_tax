import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugifyTitle } from '../../lib/blogToc';

function getText(children) {
  if (children == null) return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getText).join('');
  if (typeof children === 'object' && children.props != null) return getText(children.props.children);
  return '';
}

/**
 * Renders post body with heading ids aligned to extractMarkdownToc() order.
 */
export default function BlogMarkdown({ body, toc }) {
  const list = toc || [];
  let t = 0;

  const components = {
    h2({ children }) {
      let id = slugifyTitle(getText(children)) || 'section';
      if (t < list.length && list[t].depth === 2) {
        id = list[t].id;
        t += 1;
      }
      return <h2 id={id}>{children}</h2>;
    },
    h3({ children }) {
      let id = slugifyTitle(getText(children)) || 'section';
      if (t < list.length && list[t].depth === 3) {
        id = list[t].id;
        t += 1;
      }
      return <h3 id={id}>{children}</h3>;
    }
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {body || ''}
    </ReactMarkdown>
  );
}
