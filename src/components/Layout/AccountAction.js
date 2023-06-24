import { Alert, Avatar, Button, Card, Flex, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "telegram";
import { apiLogout, setAskLogin } from "../../store/reducers/root";
import { ClientContext } from "../ClientProvider";

export default function AccountAction() {
  const dispatch = useDispatch();
  const client = useContext(ClientContext);
  const user = useSelector((state) => state.user);
  const openLogin = () => dispatch(setAskLogin(true));
  const [loading, setLoading] = useState(false);

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
        <Card withBorder shadow="xs" p={10}>
          <Flex align={"center"}>
            <Avatar size={45} mr={5} />
            <div style={{ flex: 1 }}>
              <Text size="sm">
                Logged in as{" "}
                <Text component="span" weight={600}>
                  {user.userInfo?.firstName}
                </Text>
              </Text>

              <Text color="dimmed" size="sm">
                Phone: {user.userInfo?.phone}
              </Text>
            </div>
          </Flex>
          <Button
            variant="light"
            mt={10}
            fullWidth
            onClick={logOut}
            loading={loading}
          >
            Log out
          </Button>
        </Card>
      )}
    </>
  );
}
