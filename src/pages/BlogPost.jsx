import { Link, useParams } from 'react-router-dom'
import styles from './Blog.module.css'
import { getPost, formatDate } from './blogPosts'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <div className={styles.page}>
        <Link to="/blog" className={styles.back}>← blog</Link>
        <p className={styles.placeholder}>post not found.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to="/blog" className={styles.back}>← blog</Link>
      <article className={styles.post}>
        <time className={styles.postDate}>{formatDate(post.date)}</time>
        <h1 className={styles.postTitle}>{post.title}</h1>
        {post.body
          .trim()
          .split(/\n\s*\n/)
          .map((para, i) => (
            <p key={i} className={styles.paragraph}>
              {para.trim()}
            </p>
          ))}
      </article>
    </div>
  )
}
