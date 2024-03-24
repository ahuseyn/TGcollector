import {
  AppShell,
  Badge,
  Burger,
  Button,
  Code,
  Flex,
  Header,
  Navbar,
  ScrollArea,
  Switch,
  Text,
  Title,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { IconBrandGithub, IconMoonStars, IconSun } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { Outlet } from "react-router-dom";
import { toggleTheme, updateJob } from "store/reducers/root";
import AccountAction from "./AccountAction";
import ActiveJob from "./ActiveJob";
import Login from "./Login";
import NavbarMenu from "./NavbarMenu";

const useStyles = createStyles((theme) => ({
  headerInner: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  title: {
    [theme.fn.smallerThan("sm")]: {
      fontSize: "1.5rem",
      marginLeft: "-0.25rem",
    },
  },
  betaBadge: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  ghButton: {
    [theme.fn.smallerThan("xs")]: {
      ".mantine-Button-leftIcon": {
        marginRight: "-5px",
      },
      ".mantine-Button-label": {
        display: "none",
      },
    },
  },
}));

export default function Layout() {
  const theme = useMantineTheme();
  const store = useStore();
  const { classes } = useStyles();
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
            TG collector 2024 <Code>1.6.1-beta</Code>
          </Text>
          <Text color="dimmed" size={"xs"}>
            Copyright H Aghayev, S Mammadova
          </Text>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div className={classes.headerInner}>
            <Burger
              className={classes.burger}
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />

            <Flex align={"center"}>
              <Title
                className={classes.title}
                component="a"
                href={"/"}
                size="h1"
                order={1}
                ml={"sm"}
                ff="'Montez'"
              >
                TG collector{" "}
              </Title>

              <Badge ml={"sm"} className={classes.betaBadge} size="xs">
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
              className={classes.ghButton}
            >
              <span>GitHub</span>
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
