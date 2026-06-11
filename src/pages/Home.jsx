import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.about}>
        <img src="/images/personal.jpg" alt="Jason" className={styles.photo} />
        <div className={styles.aboutContent}>
          <h1 className={styles.name}>Hi, I am Jason Nguyen!</h1>
          <p className={styles.bio}>
            I am currently a sophomore at University of Central Florida majoring
            in computer science. I am passionate about problem solving, building,
            and personal growth! I tend to hyperfixate on tasks that challenge me
            in a unique way that ultimately benefits my learning. Some hobbies I
            love are chess, gaming, and traveling!
          </p>
          <p className={styles.bio}>
            What do I plan to use this portfolio for? I want to display what I build, think, and create.
            Through this display, I hope to meet like-minded people along the way! Beyond my skills, this site reflects
            what I'm passionate about and my progress!
          </p>
        </div>
      </div>
    </div>
  )
}
