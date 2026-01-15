
"use client";

import { useEffect, useState } from 'react';

interface TiktokEmbedProps {
    embedCode: string;
}

export function TiktokEmbed({ embedCode }: TiktokEmbedProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Or a placeholder/skeleton
    }

    return (
        <div
            dangerouslySetInnerHTML={{ __html: embedCode }}
            className="[&_blockquote]:mx-auto [&_blockquote]:max-w-sm"
        />
    );
}
