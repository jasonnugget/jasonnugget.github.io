import { Link } from 'react-router-dom'
import styles from './Blog.module.css'
import { postsWithSlugs, formatDate } from './blogPosts'

export default function Blog() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>blog</h1>
      {postsWithSlugs.length === 0 ? (
        <p className={styles.placeholder}>nothing here yet — check back soon.</p>
      ) : (
        <div className={styles.list}>
          {postsWithSlugs.map(({ slug, date, title }) => (
            <Link key={slug} to={`/blog/${slug}`} className={styles.item}>
              <time className={styles.date}>{formatDate(date)}</time>
              <span className={styles.title}>{title}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
