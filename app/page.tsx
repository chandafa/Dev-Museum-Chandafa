import { getGithubArchive } from "@/lib/github";
import { HomeExperience } from "@/components/home-experience";

export const revalidate = 300;

export default async function Home() {
  const archive = await getGithubArchive();

  return <HomeExperience archive={archive} />;
}
