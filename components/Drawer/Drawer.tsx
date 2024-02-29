import { useState } from "react";
import { IDrawerProps } from "./Drawer.types";
import { Drawer as PaperDrawer } from "react-native-paper";

const Drawer = ({}: IDrawerProps) => {
  const [active, setActive] = useState(0);

  return (
    <PaperDrawer.Section title="Some title">
      <PaperDrawer.Item
        label="First Item"
        active={active === 1}
        onPress={() => setActive(1)}
      />
      <PaperDrawer.Item
        label="Second Item"
        active={active === 2}
        onPress={() => setActive(2)}
      />
    </PaperDrawer.Section>
  );
};

export default Drawer;
