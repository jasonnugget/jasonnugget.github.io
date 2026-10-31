export function Contact() {
  return <section aria-labelledby="contact-heading">
    <h2 id="contact-heading" className="mb-6 text-sm font-medium">find me online</h2>
    <ul className="space-y-4">
      {[
        ['github', 'https://github.com/jasonnugget'],
        ['linkedin', 'https://www.linkedin.com/in/j-nguyen05/'],
        ['twitter', 'https://x.com/jasonexpl0res'],
      ].map(([label, href]) => <li key={label}><a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{label}<span className="ml-2 text-zinc-500" aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>)}
    </ul>
  </section>;
}
