import { Divider, NavLink, ThemeIcon } from "@mantine/core";
import { IconFolder, IconHome, IconPlus } from "@tabler/icons";
import Folders from "components/Folders";
import insertCollection from "helpers/insertCollection";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavbarMenu() {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const collections = useSelector((state) => state.collections, shallowEqual);

  const _insertCollection = () =>
    insertCollection(Object.keys(collections).length + 1, dispatch, navigate);

  return (
    <>
      <NavLink
        label="Home"
        icon={
          <ThemeIcon>
            <IconHome size={16} stroke={1.5} />
          </ThemeIcon>
        }
        active={pathname === `/`}
        childrenOffset={28}
        defaultOpened
        component={Link}
        to="/"
      />
      <NavLink
        label="New collection"
        icon={
          <ThemeIcon color="yellow">
            <IconPlus size={16} stroke={1.5} />
          </ThemeIcon>
        }
        childrenOffset={28}
        defaultOpened
        onClick={_insertCollection}
      />

      {user.logged && (
        <>
          <Divider label="Telegram folders" p={10} />
          <Folders />
        </>
      )}

      <Divider label="Collections" p={10} />

      {Object.values(collections).map((item) => (
        <NavLink
          key={item.id}
          label={item.title}
          to={`/collection/${item.id}`}
          active={pathname === `/collection/${item.id}`}
          icon={
            <ThemeIcon variant="light">
              <IconFolder size={16} stroke={1.5} />
            </ThemeIcon>
          }
          childrenOffset={28}
          component={Link}
        />
      ))}
    </>
  );
}
