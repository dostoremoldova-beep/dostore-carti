import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { styles } from "./theme";
import { formatPrice } from "@/lib/format";

export function PaymentConfirmedEmail({
  customerName,
  orderNumber,
  total,
  trackingUrl,
}: {
  customerName: string;
  orderNumber: string;
  total: number;
  trackingUrl?: string;
}) {
  const firstName = customerName.split(" ")[0] || customerName;

  return (
    <EmailLayout preview={`Plata pentru comanda ${orderNumber} a fost confirmată`}>
      <Text style={styles.heading}>Plata a fost confirmată ✅</Text>
      <Text style={styles.paragraph}>
        Bună, {firstName}! Am primit plata de{" "}
        <span style={styles.strong}>{formatPrice(total)}</span> pentru comanda{" "}
        <span style={styles.strong}>{orderNumber}</span>. Totul e în regulă — pregătim
        coletul și îl trimitem spre tine.
      </Text>

      <Section style={styles.infoBox}>
        <Text style={styles.label}>Număr comandă</Text>
        <Text style={styles.value}>{orderNumber}</Text>
        <Text style={{ ...styles.label, margin: "10px 0 4px" }}>Sumă plătită</Text>
        <Text style={styles.value}>{formatPrice(total)}</Text>
      </Section>

      {trackingUrl && (
        <Section style={{ textAlign: "center", margin: "8px 0 20px" }}>
          <Button href={trackingUrl} style={styles.button}>
            Urmărește comanda
          </Button>
        </Section>
      )}

      <Text style={styles.paragraph}>
        Vei fi anunțat când comanda pleacă la livrare. Îți mulțumim că ai ales Dostore Carti!
      </Text>
    </EmailLayout>
  );
}
