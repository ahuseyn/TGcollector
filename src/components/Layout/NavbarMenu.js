import { Divider, NavLink, ThemeIcon } from "@mantine/core";
import { IconFolder, IconHome, IconPlus } from "@tabler/icons";
import { nanoid } from "nanoid";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { insertCollection } from "../../store/reducers/root";
import { insertChannelsIDB } from "../../pages/Collection/helpers/insertCollectionIDB";

export default function NavbarMenu() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const collections = useSelector((state) => state.collections, shallowEqual);

  const _insertCollection = () => {
    const id = nanoid(8);
    const title = `Collection ${Object.keys(collections).length + 1}`;

    dispatch(
      insertCollection({
        [id]: { id, title, channels: {} },
      })
    );

    insertChannelsIDB(id);
  };

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
