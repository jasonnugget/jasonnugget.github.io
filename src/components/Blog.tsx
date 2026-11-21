import { posts } from '../content/posts';

export function Blog() {
  return <section aria-labelledby="blog-heading">
    <h2 id="blog-heading" className="sr-only">Blog posts</h2>
    <ul className="blog-list">
      {posts.map(post => <li key={post.href}>
        <article>
          <a className="blog-preview" href={post.href}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <time dateTime={post.date}>{post.displayDate}</time>
          </a>
        </article>
      </li>)}
    </ul>
  </section>;
}
