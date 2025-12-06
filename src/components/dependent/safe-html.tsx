import DOMPurify from "isomorphic-dompurify";

export default function SafeHtml({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
