import { Paper, Text, ThemeIcon, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 150ms ease, box-shadow 100ms ease",
    padding: theme.spacing.xl,
    paddingLeft: `calc(${theme.spacing.xl} * 2)`,

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.02)",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: 6,
    },
  },
}));

export default function HelpCard({
  title,
  description,
  url,
  icon,
  color = "orange",
  ...rest
}) {
  const Icon = icon;
  const { classes } = useStyles();

  const openUrl = () => window.open(url, "_blank").focus();

  return (
    <Paper
      withBorder
      radius="md"
      className={classes.card}
      onClick={openUrl}
      sx={{
        "&::before": {
          background: color,
        },
      }}
      {...rest}
    >
      <ThemeIcon size="xl" radius="md" color={color}>
        <Icon size={28} stroke={1.5} />
      </ThemeIcon>
      <Text size="xl" weight={500} mt="md">
        {title}
      </Text>
      <Text size="sm" mt="sm" color="dimmed">
        {description}
      </Text>
    </Paper>
  );
}
