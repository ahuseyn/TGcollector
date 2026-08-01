import { NavLink, Text, ThemeIcon } from "@mantine/core";
import { IconFolder } from "@tabler/icons";
import { ClientContext } from "components/ClientProvider";
import { foldersReducer } from "helpers/foldersReducer";
import { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { insertFolders } from "store/reducers/root";
import { Api } from "telegram";

export default function Folders() {
  const client = useContext(ClientContext);
  const user = useSelector((state) => state.user);
  const folders = useSelector((state) => state.folders);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const getFolder = useCallback(async () => {
    try {
      const foldersRaw = await client?.invoke(
        new Api.messages.GetDialogFilters({})
      ); // Get folders of the logged user

      const foldersFiltered = foldersRaw.filter(
        (folder) => folder.className === "DialogFilter"
      ); // Keep only correct folders

      const dialogs = await client?.getDialogs();

      const foldersReady = foldersFiltered.reduce(foldersReducer(dialogs), {}); // Convert folders into object with channels inside

      dispatch(insertFolders(foldersReady)); // Insert folders into redux store
    } catch (err) {
      console.error(err);
    }
  }, [client]);

  useEffect(() => {
    if (user.logged && client) {
      getFolder();
    }
  }, [client, user, getFolder]);

  const foldersArr = Object.values(folders);

  return (
    <>
      {foldersArr?.length === 0 ? (
        <Text size="xs" color="dimmed" ml="sm" mr="sm" mb="sm">
          Your Telegram folders will appear here. You can manage them in your
          Telegram app.
        </Text>
      ) : (
        foldersArr.map((item) => (
          <NavLink
            key={item.id}
            label={item.title}
            to={`/folder/f${item.id}`}
            active={pathname === `/folder/f${item.id}`}
            icon={
              <ThemeIcon variant="filled">
                <IconFolder size={16} stroke={1.5} />
              </ThemeIcon>
            }
            childrenOffset={28}
            component={Link}
          />
        ))
      )}
    </>
  );
}
