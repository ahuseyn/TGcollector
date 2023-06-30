import {
  Anchor,
  Button,
  Flex,
  List,
  Modal,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Buffer } from "buffer";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { apiLogin, setAskLogin } from "../../store/reducers/root";

const stringSession = new StringSession("");

const defaultState = {
  errors: {},
  stage: 0,
  remember: false,
  apiId: "",
  apiHash: "",
  qrCode: "",
  session: "",
  userInfo: {},
};

export default function Login() {
  const dispatch = useDispatch();
  const askLogin = useSelector((state) => state.auth.askLogin, shallowEqual);
  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  const apiId = Number(state.apiId.trim());
  const apiHash = String(state.apiHash.trim());

  useEffect(() => {
    setState({ ...defaultState });
    setLoading(false);
  }, [askLogin]);

  const postLogin = async (user, gramClient) => {
    if (user instanceof Api.User) {
      const sessionString = gramClient.session.save();
      const { phone, firstName } = user.toJSON();

      await gramClient.disconnect();

      dispatch(
        apiLogin({
          logged: true,
          remember: state.remember,
          session: sessionString,
          api: `${apiId},${apiHash}`,
          userInfo: { firstName, phone },
        })
      );

      dispatch(setAskLogin(false));
    } else {
      toast.error("Login failed!");
      setState({
        stage: 0,
      });
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gramClient = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 2,
      });

      await gramClient.connect();

      const user = await gramClient.signInUserWithQrCode(
        { apiId, apiHash },
        {
          onError: async function () {
            return true;
          },
          qrCode: async (code) => {
            const base64Token = Buffer.from(code.token).toString("base64");

            setState((prev) => ({
              ...prev,
              stage: 1,
              qrCode: `tg://login?token=${base64Token}`,
            }));
          },
          password: async (hint) => {
            setState((prev) => ({
              ...prev,
              stage: 2,
              passwordHint: hint,
            }));

            return null;
          },
        }
      );

      postLogin(user, gramClient);
    } catch (err) {
      if (String(err) !== "Error: AUTH_USER_CANCEL") {
        toast.error(String(err) + "");
      }

      setLoading(false);
    }
  };

  const passwordLogin = async (e) => {
    e.preventDefault();

    try {
      const gramClient = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 2,
      });

      await gramClient.connect();

      const user = await gramClient.signInWithPassword(
        { apiId, apiHash },
        {
          password: () => state.password,
          onError: (e) => {
            toast.error(e + "");
          },
        }
      );

      postLogin(user, gramClient);
    } catch (err) {
      toast.error(err);
      setState({
        stage: 0,
      });
    }
  };

  return (
    <Modal
      centered
      opened={askLogin}
      onClose={() => dispatch(setAskLogin(false))}
    >
      {state.stage === 0 ? (
        <form onSubmit={onLogin}>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Login to Telegram
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Login to add channels and collect messages. Go{" "}
            <Anchor href="https://my.telegram.org/auth" target="_blank">
              https://my.telegram.org/auth
            </Anchor>{" "}
            to get your API credentials.
          </Text>
          <Paper withBorder shadow="md" p={30} mt={30}>
            <TextInput
              withAsterisk={false}
              label="API ID"
              required
              value={state.apiId}
              onChange={(e) => setState({ ...state, apiId: e.target.value })}
            />
            <PasswordInput
              withAsterisk={false}
              label="API Hash"
              required
              mt="md"
              value={state.apiHash}
              onChange={(e) => setState({ ...state, apiHash: e.target.value })}
            />
            {/* <Group position="apart" mt="lg">
              <Checkbox
                label="Remember me"
                checked={state.remember}
                onChange={(e) =>
                  setState({
                    ...state,
                    remember: e.currentTarget.checked,
                  })
                }
              />
            </Group> */}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Sign in
            </Button>
          </Paper>
        </form>
      ) : state.stage === 2 ? (
        <form onSubmit={passwordLogin}>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            2FA Authorization
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Hint: {state.passwordHint || "no hint available"}
          </Text>
          <Paper withBorder shadow="md" p={30} mt={30}>
            <PasswordInput
              placeholder="Enter your password"
              required
              mt="md"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
            <Button fullWidth mt="xl" type="submit">
              Log in
            </Button>
          </Paper>
        </form>
      ) : (
        <>
          <Title
            align="center"
            mb={10}
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Login by QR code
          </Title>

          <Flex justify={"center"}>
            <List type="ordered">
              <List.Item>{"Open Telegram on your device"}</List.Item>
              <List.Item>{"Open Settings > Devices > Link"}</List.Item>
              <List.Item>{"Scan the QR code below"}</List.Item>
            </List>
          </Flex>

          <Paper
            component={Flex}
            withBorder
            shadow="md"
            p={30}
            mt={25}
            align={"center"}
            justify={"center"}
            direction={"column"}
          >
            <div>
              <QRCodeSVG width={240} height={240} value={state.qrCode} />
            </div>
          </Paper>
        </>
      )}
      <Text color="dimmed" size="sm" align="center" mt={15}>
        By using this website, you are agreeing to the{" "}
        <Anchor
          onClick={() => dispatch(setAskLogin(false))}
          component={Link}
          to="/terms"
        >
          Terms of Use
        </Anchor>
        .
      </Text>
    </Modal>
  );
}
