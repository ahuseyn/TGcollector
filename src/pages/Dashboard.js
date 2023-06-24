import { Anchor, Box, Container, Text, Title } from "@mantine/core";

export default function Dashboard() {
  return (
    <Container fluid>
      <Box w={720}>
        <Title size={"h2"} mb={"lg"}>
          A few words on TG collector
        </Title>
        <Text>
          Tg collector (TGC) is a browser based graphical user interface for
          collecting Telegram messages from the channels. The purpose of this
          tool is to facilitate the workload of researchers who work with
          Telegram channels.
        </Text>
        <Text mt={"sm"}>
          <strong>TGC is a tool</strong>, not a service, therefore does not
          collect any personal data (except anonymous usage statistics described
          below). All operations taking place on the browser, all data,
          including Telegram credentials being kept either in{" "}
          <Anchor
            href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
            target="_blank"
          >
            localStorage
          </Anchor>{" "}
          or{" "}
          <Anchor
            href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
            target="_blank"
          >
            IndexedDB
          </Anchor>
          . TGC has no responsibility for the data collected on the user's
          browser.
        </Text>
        <Text mt={"sm"}>
          TGC uses{" "}
          <Anchor href="https://vercel.com/analytics" target="_blank">
            Vercel Analytics
          </Anchor>{" "}
          tool to count page views and basic interaction data. This data is
          anonymous and not related to the user.
        </Text>
        <Text mt={"sm"}>
          Collections and collected messages does not attached to the specific
          Telegram account. So if you log out from your account they will not go
          away. And you can use another account to continue the work with.
        </Text>
      </Box>
    </Container>
  );
}
