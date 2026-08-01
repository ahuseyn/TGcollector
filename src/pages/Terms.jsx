import { Container, List, Text, Title, createStyles } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    maxWidth: 720,
    wordWrap: "break-word",
    padding: 5,
  },
  title: {
    marginTop: theme.spacing.lg,
    marginBottom: 5,
    fontSize: 16,
  },
  list: {
    listStyleType: "lower-alpha",
  },
}));

export default function Terms() {
  const { classes } = useStyles();

  return (
    <Container fluid>
      <div className={classes.container}>
        <Title size={"h2"} mb={"lg"}>
          Terms of Use
        </Title>
        <Text>
          These Terms and Conditions ("Agreement") govern your use of the
          tgcollector.com ("website") and the open source tool ("tool") hosted
          on it. By accessing or using our website and tool, you agree to be
          bound by this Agreement. If you do not agree with any part of this
          Agreement, please refrain from using tgcollector.com.
        </Text>
        <Title className={classes.title} order={2}>
          1. Website Usage
        </Title>
        <List className={classes.list}>
          <List.Item>
            tgcollector.com hosts an open source tool that is provided to users
            free of charge. The tool is accessed and used directly through a web
            browser.
          </List.Item>
          <List.Item>
            The tool requires users to log in using their Telegram account
            credentials. These credentials are stored in the user's local
            browser storage (localStorage).
          </List.Item>
          <List.Item>
            The website does not collect, store, or transmit any user
            information, including personally identifiable information or
            user-generated content.
          </List.Item>
          <List.Item>
            Users are solely responsible for the security of their own
            credentials and the security of their browsers.
          </List.Item>
        </List>
        <Title className={classes.title} order={2}>
          2. Liability
        </Title>
        <List className={classes.list}>
          <List.Item>
            The tgcollector.com website and tool are provided on an "as is"
            basis without any warranties, express or implied warranties. The
            website owner and its affiliates disclaim all warranties regarding
            the website's availability, functionality, and accuracy.
          </List.Item>
          <List.Item>
            The website owner and its affiliates shall not be liable for any
            direct, indirect, incidental, consequential, or exemplary damages
            arising from the use of the website or the open source tool.
          </List.Item>
          <List.Item>
            The website owner shall not be responsible for any security breaches
            or unauthorized access to user credentials stored in the local
            browser storage (localStorage).
          </List.Item>
          <List.Item>
            Users understand and acknowledge that they use the website and tool
            at their own risk and are solely responsible for any consequences
            resulting from such use.
          </List.Item>
        </List>
        <Title className={classes.title} order={2}>
          3. Intellectual Property
        </Title>
        <List className={classes.list}>
          <List.Item>
            The open source tool hosted on tgcollector.com is subject to the
            applicable open source license agreement. Users are bound by the
            terms of the respective open source license agreement when using the
            tool.
          </List.Item>
        </List>
        <Title className={classes.title} order={2}>
          4. Modifications to the Terms and Conditions
        </Title>
        <List className={classes.list}>
          <List.Item>
            The website reserves the right to modify or update these Terms and
            Conditions at any time without prior notice. Users are encouraged to
            review the Terms and Conditions periodically.
          </List.Item>
          <List.Item>
            Continued use of the website and the Tool after any modifications or
            updates to the Terms and Conditions shall constitute acceptance of
            the modified Agreement.
          </List.Item>
        </List>
        <Title className={classes.title} order={2}>
          5. Jurisdiction and Governing Law
        </Title>
        <List className={classes.list}>
          <List.Item>
            This Agreement shall be governed by and construed in accordance with
            the laws of Poland.
          </List.Item>
          <List.Item>
            Any disputes arising from this Agreement shall be subject to the
            exclusive jurisdiction of the courts of Poland.
          </List.Item>
        </List>
      </div>
    </Container>
  );
}
