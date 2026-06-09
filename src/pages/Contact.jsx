import styles from './Contact.module.css'

const links = [
  {
    label: 'github',
    href: 'https://github.com/jasonnugget',
    description: 'jasonnugget',
  },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/j-nguyen05/',
    description: 'j-nguyen05',
  },
  {
    label: 'twitter',
    href: 'https://x.com/jasonexpl0res',
    description: 'jasonexpl0res',
  },
]

export default function Contact() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>contact</h1>
      <div className={styles.links}>
        {links.map(({ label, href, description }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <span className={styles.platform}>{label}</span>
            <span className={styles.handle}>{description}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
