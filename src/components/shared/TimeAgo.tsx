"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface TimeAgoProps {
    date: string;
    className?: string;
    short?: boolean;
}

export function TimeAgo({ date, className = "", short = false }: TimeAgoProps) {
    const timeAgo = formatDistanceToNow(new Date(date), {
        addSuffix: !short,
        locale: id,
    });

    // Short format: "2 jam lalu" -> "2j"
    if (short) {
        const shortFormat = timeAgo
            .replace(/sekitar /i, "")
            .replace(/ detik/i, "d")
            .replace(/ menit/i, "m")
            .replace(/ jam/i, "j")
            .replace(/ hari/i, "h")
            .replace(/ minggu/i, "mg")
            .replace(/ bulan/i, "bl")
            .replace(/ tahun/i, "th")
            .replace(/kurang dari /i, "<");
        return <span className={className}>{shortFormat}</span>;
    }

    // Clean format: remove "sekitar" for cleaner text
    const cleanTimeAgo = timeAgo
        .replace(/sekitar /i, "")
        .replace(/yang /i, "");

    return <span className={className}>{cleanTimeAgo}</span>;
}
