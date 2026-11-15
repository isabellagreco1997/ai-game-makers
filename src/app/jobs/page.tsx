import type { Metadata } from "next";
import JobBoard from "./JobBoard";

export const metadata: Metadata = {
  title: "Find Game & AI Jobs | AI Game Makers Club",
  description: "Explore remote game development and AI opportunities, discover the skills employers ask for, and find your next role.",
};

export default function JobsPage() { return <JobBoard />; }
