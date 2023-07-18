import { Col, Container, Grid } from "@mantine/core";
import { IconBug, IconSchool } from "@tabler/icons";
import HelpCard from "../../components/HelpCard";
import { About } from "./About";
import Banner from "./Banner";

export default function Dashboard() {
  return (
    <Container fluid>
      <Banner />
      <Grid mt={"xl"} gutter={40} mb={"lg"}>
        <Col sm={12} md={6} lg={4}>
          <HelpCard
            url={
              "https://medium.com/the-first-digit/open-source-tool-for-open-source-researchers-how-to-use-tg-collector-to-scrape-telegram-channels-a5e934ea3cf1"
            }
            icon={IconSchool}
            title={"Tutorial to get started"}
            description={
              "This walkthrough will help you to understand how TGC works and will onboard you quickly."
            }
            mb="md"
            color="green"
          />
          <HelpCard
            color="red"
            url={"https://github.com/ahuseyn/TGcollector/issues"}
            icon={IconBug}
            title={"Report an issue"}
            description={
              "Report the issues you've encountered on GitHub issues page."
            }
          />
        </Col>
        <Col sm={12} md={6} lg={8}>
          <About />
        </Col>
      </Grid>
    </Container>
  );
}
