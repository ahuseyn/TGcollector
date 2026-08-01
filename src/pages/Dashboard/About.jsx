import { Anchor, Box, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { IconStar } from "@tabler/icons";

export function About() {
  return (
    <Box maw={720}>
      <Group mb={"xl"}>
        <ThemeIcon
          size={"lg"}
          variant="gradient"
          gradient={{ deg: 0, from: "red", to: "orange" }}
        >
          <IconStar />
        </ThemeIcon>
        <Title size={"h3"}>New feature: Telegram folders</Title>
        <Text>
          Now you can see your Telegram folders after you log in, on the left
          side, just above the collections.{" "}
          <u>
            Telegram Folders are the feature inside Telegram app, allowing you
            to organize your chats.
          </u>{" "}
          If you enter a folder, you can see the channels inside the folder that
          has usernames. You can select the channels and collect messages as you
          do in collections. But for updating the folder and adding new
          channels, you should either use Telegram app or Telegram Web.
        </Text>
      </Group>

      <Title size={"h3"} mb={"lg"}>
        More about TG collector
      </Title>
      <Text>
        <u>TGC is a tool</u>, not a service, therefore does not collect any
        personal data (except anonymous usage statistics described below). All
        operations taking place on the browser, all data, including Telegram
        credentials being kept either in{" "}
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
        away. And you can use another account to continue the work with.{" "}
        <u>
          It also means if you clean your browser's data all your collections
          will be gone.
        </u>
      </Text>
    </Box>
  );
}
