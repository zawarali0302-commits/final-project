import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_hsl(var(--background))_55%)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center gap-6">
        <Link href="/" className="mx-auto flex items-center gap-3 font-medium">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>Resultify</span>
        </Link>
        {children}
      </div>
    </div>
  )
}

export default Authlayout
