import {
  Button,
  Col,
  Flex,
  Grid,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrowser,
  IconEyeOff,
  IconFolders,
} from "@tabler/icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import insertCollection from "../../helpers/insertCollection";

const features = [
  {
    icon: IconBrowser,
    title: "Browser based",
    description:
      "Collect Telegram messages for your research without installing anything on your computer.",
  },
  {
    icon: IconEyeOff,
    title: "No personal data collected",
    description:
      "We don't collect any personal data. Only you and Telegram knows what you're doing.",
  },
  {
    icon: IconBrandGithub,
    title: "Open source",
    description:
      "TGcollector is an open source software. Refer to the GitHub page. Contributions are welcomed.",
  },
  {
    icon: IconFolders,
    title: "Get organized",
    description:
      "Organize your channels to track easily. Select only fields you want. Download your data as JSON or CSV.",
  },
];

export default function Banner() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const collections = useSelector((state) => state.collections, shallowEqual);

  const _insertCollection = () =>
    insertCollection(Object.keys(collections).length + 1, dispatch, navigate);

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ deg: 0, from: "indigo", to: "blue" }}>
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <Paper shadow={"lg"} p={"lg"}>
      <Grid gutter={80}>
        <Col sm={12} md={12} lg={6}>
          <Title order={1} fw={900}>
            The Telegram collector you've been waiting for
          </Title>
          <Text c="dimmed" mt={"lg"}>
            TG collector (TGC) is a browser based graphical user interface for
            collecting Telegram messages from the channels. It will help you to
            facilitate your Telegram based research projects. Besides collecting
            messages you'll be able to organize your channels in folders. After
            collecting messages you can download them as JSON or CSV. Your
            collecting projects will be in your browser to download at any time.
          </Text>

          <Flex align={"center"} mt="xl" c="indigo">
            <Text fw={"bold"} mr={"sm"} size={"sm"}>
              {"Create your first collection to"}
            </Text>
            <Button
              variant="gradient" 
              gradient={{ deg: 0, from: "indigo", to: "blue" }}
              size="md"
              radius="md"
              onClick={_insertCollection}
            >
              get started
            </Button>
          </Flex>
        </Col>
        <Col sm={12} md={12} lg={6}>
          <SimpleGrid
            cols={2}
            spacing={30}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {items}
          </SimpleGrid>
        </Col>
      </Grid>
    </Paper>
  );
}
