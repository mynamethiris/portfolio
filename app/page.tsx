import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Skills from "@/components/Skills";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import { getRepos, getGitHubProfile } from "@/lib/getRepos";

export const revalidate = 3600;

// Home page: composes all sections with fresh GitHub data.
export default async function Home() {
  const [repos, githubProfile] = await Promise.all([getRepos(), getGitHubProfile()]);

  return (
    <main>
      <Hero />
      <About githubProfile={githubProfile} />
      <Education />
      <Projects repos={repos} />
      <Certificates />
      <Skills />
      <GitHubActivity />
      <Contact />
    </main>
  );
}
