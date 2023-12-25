import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function ResetPasswordEmail({
  userFirstname = "",
  resetPasswordLink = "https://lafaktur.com/auth/sign-in",
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Lafaktur - Reset your password</Preview>
      <Tailwind
        config={{
          theme: {
            colors: {
              background: "hsl(0 0% 100%)",
              foreground: "hsl(240 10% 3.9%)",
              primary: {
                DEFAULT: "hsl(142.1 76.2% 36.3%)",
                foreground: "hsl(355.7 100% 97.3%)",
              },
            },
          },
        }}
      >
        <Body className="bg-background font-sans text-base font-normal text-foreground">
          <Container className="p-4">
            <Section>
              <Text>Hello {userFirstname},</Text>
              <Text>
                Someone recently requested a password change for your Lafaktur
                account. If this was you, you can set a new password here:
              </Text>
              <Button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href={resetPasswordLink}
              >
                Reset password
              </Button>
              <Text>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text>
                Sincerely,
                <br />
                The Lafaktur team
              </Text>
            </Section>
            <Img
              src={`${baseUrl}/images/logo-light.png`}
              width="128"
              height="24"
              alt="Lafaktur"
              style={{ objectFit: "contain" }}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ResetPasswordEmail;
