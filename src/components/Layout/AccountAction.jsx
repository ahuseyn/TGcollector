import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Flex,
  Menu,
  Text,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconAlertCircle, IconDots, IconEye, IconEyeOff } from "@tabler/icons";
import { ClientContext } from "components/ClientProvider";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiLogout, setAskLogin } from "store/reducers/root";
import { Api } from "telegram";

export default function AccountAction() {
  const dispatch = useDispatch();
  const client = useContext(ClientContext);
  const user = useSelector((state) => state.user);
  const openLogin = () => dispatch(setAskLogin(true));
  const [loading, setLoading] = useState(false);
  const [phone, togglePhone] = useToggle([false, true]);

  const logOut = async () => {
    if (!user.logged) return;

    setLoading(true);

    await client.invoke(new Api.auth.LogOut({}));

    dispatch(apiLogout());
    setLoading(false);
  };

  return (
    <>
      {!user.logged ? (
        <>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Not logged in!"
            color="red"
            mb={"md"}
          >
            If you want to add channels or collect messages, you should log in
            to your Telegram account.
          </Alert>
          <Button onClick={openLogin} fullWidth>
            Login to Telegram
          </Button>
        </>
      ) : (
        <Card withBorder shadow="xs" sx={{ overflow: "visible" }} p={10}>
          <Flex align={"center"}>
            <div style={{ flex: 1 }}>
              <Text size="sm">
                Logged in as{" "}
                <Text component="span" weight={600}>
                  {user.userInfo?.firstName}
                </Text>
              </Text>

              <Flex>
                <Text color="dimmed" size="sm">
                  Phone:
                </Text>
                {phone && (
                  <Text ml={5} color="dimmed" size="sm">
                    {user.userInfo?.phone}
                  </Text>
                )}
                <ActionIcon
                  variant="filled"
                  size="sm"
                  aria-label="Show phone number"
                  ml={5}
                  onClick={togglePhone}
                >
                  {phone ? <IconEyeOff /> : <IconEye />}
                </ActionIcon>
              </Flex>
            </div>
            <Menu shadow="xs" withArrow position="bottom-end">
              <Menu.Target>
                <ActionIcon color="indigo">
                  <IconDots size="1.25rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Button
                  w={160}
                  variant="light"
                  onClick={logOut}
                  loading={loading}
                  icon={<IconDots size={14} />}
                >
                  Log out
                </Button>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Card>
      )}
    </>
  );
}
