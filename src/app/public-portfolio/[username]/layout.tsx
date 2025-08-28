// src/app/public-portfolio/[username]/layout.tsx
import StarsCanvas from '@/components/StarCanvas';
import { Metadata } from 'next';
import { Toaster } from 'sonner';

interface RouteParams {
  username: string;
}


export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { username } = await params;
  
  return {
    title: `Portfolio of ${username}`,
    description: `Explore ${username}'s portfolio on the Portfolio platform.`,
  };
}

export default function PublicPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Stars */}
      <StarsCanvas />

      {/* Foreground Content */}
      <main className="relative z-10">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}