import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"
import { UrlObject } from "node:url"

interface EmptyStateProps {
    icon?: React.ReactNode
    title?: string
    description?: string
    button: string
    href: string | UrlObject
}

export function EmptyState({ icon, title, description, button, href }: EmptyStateProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    {icon}
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>
                    {description}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <Button asChild>
                    <Link href={href}>{button}</Link>
                </Button>
            </EmptyContent>
        </Empty>
    )
}
