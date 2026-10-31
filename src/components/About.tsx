export function About() {
  return <section className="about-section" aria-label="About Jason">
    <div className="about-copy">
      <p>Hi, my name is Jason Nguyen! I am a student at the University of Central Florida, majoring in computer science with a minor in mathematics. I enjoy solving problems and building for real users through automation, scripting, and scalable systems.</p>
      <p>Outside of programming, I enjoy playing sports like basketball and pickleball, and I used to play lacrosse. I also play chess from time to time and currently have a rating of 1400 on chess.com.</p>
      <p>Recently, I have been spending most of my free time programming and building projects to better understand computers, data structures and algorithms, and how the web works.</p>
    </div>
    <aside className="about-note" aria-labelledby="background-note-heading">
      <h2 id="background-note-heading">a note about the background</h2>
      <p>The squares in the background are inspired by a Rubik’s cube: a 6 × 8 arrangement of 3 × 3 grids, each representing a flattened cube face. I originally planned to show different algorithms and stages of a solve to reflect my enjoyment of cubing, but it turned out to be more involved than I expected. Hopefully, I’ll add that in the future!</p>
    </aside>
  </section>;
}
