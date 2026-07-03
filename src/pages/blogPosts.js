// Blog posts — newest first.
//
// To add a new post, copy the block below, paste it at the TOP of the array
// (right after `export const posts = [`), and fill it in:
//
//   {
//     date: '2026-07-03',            // YYYY-MM-DD
//     title: 'Your title here',
//     body: `
// Write your post here. Blank lines separate paragraphs.
// You can write as many paragraphs as you like.
//     `,
//   },
//
// That's it — save the file and the post shows up automatically.

export const posts = [
  {
    date: '2026-07-03',
    title: 'Can I Learn to Reverse Engineer Antibot in 30 Days | Day 1',
    body: `
When I was a kid, I was always fascinated by how checkout bots work. Over summer, I really had no projects
planned or anything, so I started diving deep into how a checkout bot works. Turns out it is really complicated
and I genuinely have no idea or where to start. I have a grasp or flow of how things work, but it is difficult for me
to piece it all together as each antibot is very different. 

So for my summer project, I want to learn if I could program a checkout bot, with my first primary focus being f5 shape security.
I will upload resources that I found helpful, share my progress, and hopefully be able to buy some pokemon. This is my first day,
so essentially I will be trying to build a checkout flow mainly through requests.

Another issue I ran into is that it is very difficult to get Claude or ChatGPT to teach or generate code to help. That is another
reason I think it is difficult for me to learn. Anyways, I think bot developers are so cool just by the fact they are in constant
competition. My goal is to be able to reverse engineer shape by the end of the month hopefully and get it done. Then move onto a different
antibot in the future.

Edit at 3:04AM. I really don't know how any of this works. I just got claude to de-obfuscate a challenge.js file from shopify, but that is it.
I think I will just try to create a flow however (could be insanely inefficient, but as long as it works?) and improve it from there.
    `,
  },
]

// --- helpers (you don't need to touch anything below) ---

// Turns a title into the URL slug, e.g. "Starting a blog" -> "starting-a-blog".
// The post's page lives at /blog/<slug>. (Changing a title changes its URL.)
export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Posts with a `slug` attached, ready to render/link.
export const postsWithSlugs = posts.map((p) => ({ ...p, slug: slugify(p.title) }))

export function getPost(slug) {
  return postsWithSlugs.find((p) => p.slug === slug)
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
