import {
  AppShell,
  Badge,
  Burger,
  Button,
  Code,
  Flex,
  Header,
  MediaQuery,
  Navbar,
  ScrollArea,
  Switch,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconBrandGithub, IconMoonStars, IconSun } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { Outlet } from "react-router-dom";
import { toggleTheme, updateJob } from "../../store/reducers/root";
import AccountAction from "./AccountAction";
import ActiveJob from "./ActiveJob";
import Login from "./Login";
import NavbarMenu from "./NavbarMenu";

export default function Layout() {
  const theme = useMantineTheme();
  const store = useStore();
  const dispatch = useDispatch();

  const [opened, setOpened] = useState(false);

  const onToggleTheme = () => dispatch(toggleTheme());

  useEffect(() => {
    const jobs = store.getState().jobs;
    const activeJob = Object.values(jobs).find((j) => j.status === "progress");

    if (activeJob) {
      dispatch(
        updateJob({
          id: activeJob.id,
          data: {
            status: "error",
            error:
              "Process interrupted. Possible page reload, connection or power outage.",
          },
        })
      );
    }
  }, []);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow component={ScrollArea}>
            <NavbarMenu />
          </Navbar.Section>

          <Navbar.Section my={"sm"}>
            <ActiveJob />
          </Navbar.Section>
          <Navbar.Section>
            <AccountAction />
          </Navbar.Section>
          <Text color="dimmed" size={"xs"} mt="md">
            TG collector 2023 <Code>1.2.0-beta</Code>
          </Text>
          <Text color="dimmed" size={"xs"}>
            Copyright H Aghayev, S Mammadova
          </Text>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Flex align={"center"}>
              <Title
                component="a"
                href={"/"}
                size="h1"
                order={1}
                ml={"sm"}
                ff="'Montez'"
              >
                TG collector{" "}
              </Title>
              <Badge ml={"sm"} size="xs">
                BETA
              </Badge>
            </Flex>

            <Button
              ml="auto"
              mr={"sm"}
              size="xs"
              component="a"
              href="https://github.com/ahuseyn/TGcollector"
              target="_blank"
              variant="outline"
              leftIcon={<IconBrandGithub size={"1.25rem"} />}
            >
              GitHub
            </Button>

            <Switch
              size="lg"
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              onLabel={
                <IconSun
                  size="1rem"
                  stroke={2.5}
                  color={theme.colors.yellow[4]}
                />
              }
              offLabel={
                <IconMoonStars
                  size="1rem"
                  stroke={2.5}
                  color={theme.colors.indigo[6]}
                />
              }
              onChange={onToggleTheme}
            />
          </div>
        </Header>
      }
    >
      <Login />
      <Outlet />
    </AppShell>
  );
}
