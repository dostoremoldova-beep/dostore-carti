import { Button, Img, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { styles, colors } from "./theme";
import { formatPrice } from "@/lib/format";

export function NewBookAnnouncementEmail({
  title,
  author,
  coverImage,
  price,
  discountPrice,
  url,
}: {
  title: string;
  author: string;
  coverImage: string;
  price: number;
  discountPrice?: number | null;
  url: string;
}) {
  const hasDiscount = discountPrice != null && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;

  return (
    <EmailLayout preview={`Carte nouă: ${title}`}>
      <Text style={styles.heading}>A apărut o carte nouă 📚</Text>
      <Text style={styles.paragraph}>
        Tocmai am adăugat un titlu nou în librărie — poate e exact ce căutai.
      </Text>

      <Section style={{ ...styles.infoBox, textAlign: "center" }}>
        <Img
          src={coverImage}
          alt={`Coperta cărții ${title}`}
          width="140"
          style={{ borderRadius: "8px", margin: "0 auto 12px", objectFit: "cover" }}
        />
        <Text style={{ ...styles.strong, fontSize: "17px", margin: "0 0 2px" }}>{title}</Text>
        <Text style={{ ...styles.paragraph, margin: "0 0 8px" }}>{author}</Text>
        <Text style={{ fontSize: "20px", fontWeight: 700, color: colors.terracotta, margin: 0 }}>
          {formatPrice(finalPrice)}
          {hasDiscount && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: colors.inkSoft,
                textDecoration: "line-through",
                marginLeft: "8px",
              }}
            >
              {formatPrice(price)}
            </span>
          )}
        </Text>
      </Section>

      <Section style={{ textAlign: "center", marginTop: "8px" }}>
        <Button href={url} style={styles.button}>
          Vezi cartea
        </Button>
      </Section>

      <Text style={{ ...styles.footerText, marginTop: "24px", textAlign: "center" }}>
        Primești acest email pentru că ești abonat la noutățile Dostore Carti.
      </Text>
    </EmailLayout>
  );
}
