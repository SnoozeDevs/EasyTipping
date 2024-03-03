import { useState } from "react";
import { IDrawerProps } from "./Drawer.types";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = ({}: IDrawerProps) => {
  const Drawer = createDrawerNavigator();

  return <h1>Hello world</h1>;
};

export default Drawer;
