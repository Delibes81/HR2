
import type { TikTokEmbed } from "@/lib/types";
import { db } from "./firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";

export const revalidate = 0;

const toTikTokEmbed = (doc: DocumentData): TikTokEmbed => {
    const data = doc.data();
    return {
        embedCode: data.embedCode,
        isActive: data.isActive,
    };
};

const defaultTikTokEmbed: TikTokEmbed = {
    embedCode: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@holyremediesmx/video/7471424940634377478" data-video-id="7471424940634377478" data-embed-from="embed_page" style="width: 100%; height: auto;"><section><a target="_blank" title="@holyremediesmx" href="https://www.tiktok.com/@holyremediesmx?refer=embed">@holyremediesmx</a><p>El mejor date para cuando las cosas se salen de control (Tú ya sabes cuando). <a title="holymoly" target="_blank" href="https://www.tiktok.com/tag/holymoly?refer=embed">#HolyMoly</a> El boost que necesitas para equilibrar tu cuerpo. . . <a title="resaca" target="_blank" href="https://www.tiktok.com/tag/resaca?refer=embed">#resaca</a> <a title="cruda" target="_blank" href="https://www.tiktok.com/tag/cruda?refer=embed">#cruda</a> <a title="hangover" target="_blank" href="https://www.tiktok.com/tag/hangover?refer=embed">#hangover</a> <a title="fiesta" target="_blank" href="https://www.tiktok.com/tag/fiesta?refer=embed">#fiesta</a> <a title="party" target="_blank" href="https://www.tiktok.com/tag/party?refer=embed">#party</a> <a title="antro" target="_blank" href="https://www.tiktok.com/tag/antro?refer=embed">#antro</a> <a title="hidratacion" target="_blank" href="https://www.tiktok.com/tag/hidratacion?refer=embed">#hidratacion</a> <a title="vitaminas" target="_blank" href="https://www.tiktok.com/tag/vitaminas?refer=embed">#vitaminas</a> <a title="aminoacidos" target="_blank" href="https://www.tiktok.com/tag/aminoacidos?refer=embed">#aminoacidos</a> <a title="mineralesensial" target="_blank" href="https://www.tiktok.com/tag/mineralesensial?refer=embed">#mineralesensial</a></p><a target="_blank" title="♬ sonido original - holyremediesmx" href="https://www.tiktok.com/music/sonido-original-7471424968224492293?refer=embed">♬ sonido original - holyremediesmx</a></section></blockquote>`,
    isActive: true,
};

export async function getTikTokEmbed(): Promise<TikTokEmbed> {
    if (!db) {
        console.warn("Firestore no está inicializado. Devolviendo TikTok por defecto.");
        return defaultTikTokEmbed;
    }
    try {
        const tiktokRef = doc(db, "siteConfig", "tiktokEmbed");
        const tiktokSnap = await getDoc(tiktokRef);
        
        if (tiktokSnap.exists()) {
            return toTikTokEmbed(tiktokSnap);
        } else {
            return defaultTikTokEmbed;
        }

    } catch (error) {
        console.error("Error fetching TikTok embed from Firestore:", error);
        return defaultTikTokEmbed;
    }
}
