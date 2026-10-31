import { projectArt } from '../lib/projectArt';

export const achievements = [
  { id: 'halo', title: 'Halo - First Place Waymo and First Place State Farm Track', event: 'Shell Hacks 2026', href: '/projects/halo/' },
  { id: 'ottotrade', title: 'OttoTrade - Bloomberg Overall Hackathon Winner', event: 'Bloom Knights 2026', href: '/projects/ottotrade/' },
] as const;

export function Achievements({ standalone = false }: { standalone?: boolean }) {
  return <section aria-labelledby={standalone ? 'projects-heading' : 'achievements-heading'} className={standalone ? '' : 'achievements-section'}>
    <h2 id={standalone ? 'projects-heading' : 'achievements-heading'} className="font-medium">{standalone ? 'projects' : 'recent achievements'}</h2>
    <div className="mt-5 grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-10">
      {achievements.map(project => <a key={project.id} href={project.href} className="project group block">
        <div className="art-frame flex h-[210px] items-center justify-center overflow-hidden sm:h-[230px]" aria-hidden="true">
          <pre className={`ascii-art ascii-${project.id} select-none`}>{projectArt[project.id]}</pre>
        </div>
        <h3 className="mt-4 text-[13px] leading-6 underline-offset-4 group-hover:underline">{project.title}</h3>
        <p className="mt-1 text-xs leading-6 text-zinc-600">{project.event}</p>
      </a>)}
    </div>
  </section>;
}
