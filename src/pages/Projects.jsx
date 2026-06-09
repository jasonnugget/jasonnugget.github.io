import styles from './Projects.module.css'

const projects = [
  {
    name: 'Project Sense',
    href: 'https://github.com/jasonnugget/Sense',
    tech: ['Python', 'FastAPI', 'YOLO v11', 'OpenCV', 'PostgreSQL'],
    description:
      'A real-time weapon detection system built to upgrade existing camera systems. Fine-tuned YOLO v11 for accurate detection of real and false weapons. Backend built with FastAPI, OpenCV, and PostgreSQL.',
    image: '/images/projects/sense.png',
  },
  {
    name: 'Portfolio Website',
    href: null,
    tech: ['React', 'Vite', 'CSS Modules'],
    description:
      'Personal portfolio site rebuilt with React and Vite. Features a clean minimal design inspired by developer portfolios, deployed on GitHub Pages with a custom domain.',
    image: '/images/projects/portfoliosite.png',
  },
  {
    name: 'Chess Data Analysis',
    href: 'https://j4son.dev/chess-data-analysis/',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
    description:
      'Data analysis website using Pandas, Matplotlib, and Jupyter Notebook. Created hypotheses to check correlation between chess data and personal win percentages.',
    image: '/images/projects/chess data analysis.png',
  },
]

export default function Projects() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>projects</h1>
      <div className={styles.list}>
        {projects.map(({ name, href, tech, description, image }) => (
          <div key={name} className={styles.card}>
            <img src={image} alt={name} className={styles.image} />
            <div className={styles.body}>
              <div className={styles.top}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.name}
                  >
                    {name} ↗
                  </a>
                ) : (
                  <span className={styles.name}>{name}</span>
                )}
                <div className={styles.tags}>
                  {tech.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
              <p className={styles.desc}>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
