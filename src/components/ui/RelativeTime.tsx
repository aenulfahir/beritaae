"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface RelativeTimeProps {
    date: string | Date;
    className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className={className}>-</span>;
    }

    return (
        <span className={className}>
            {formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: id,
            })}
        </span>
    );
}
