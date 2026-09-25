import { notFound } from "next/navigation";
import type { Metadata } from "next";
import projectsData from "@/content/projects.json";
import { ProjectData } from "@/components/ui/ProjectCard";
import ProjectDetailView from "@/components/sections/ProjectDetailView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = projectsData as ProjectData[];
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = projectsData as ProjectData[];
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found — STUDIO PROTO",
    };
  }

  return {
    title: `${project.title} — STUDIO PROTO`,
    description: project.description,
    openGraph: {
      title: `${project.title} — STUDIO PROTO`,
      description: project.description,
      images: [
        {
          url: project.poster,
          width: 1200,
          height: 800,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = projectsData as ProjectData[];
  const currentIndex = projects.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const project = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main>
      <ProjectDetailView project={project} nextProject={nextProject} />
    </main>
  );
}
