import { getGithubArchive } from "@/lib/github";
import { ControlRoomExperience } from "@/components/sections/control-room-experience";

export const revalidate = 300;

export const metadata = {
  title: "Control Room",
  robots: {
    index: false,
    follow: false
  }
};

export default async function ControlRoomPage() {
  const archive = await getGithubArchive();
  return <ControlRoomExperience archive={archive} />;
}
