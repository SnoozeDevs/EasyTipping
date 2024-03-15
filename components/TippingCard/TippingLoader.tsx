import React from "react";
import ContentLoader, { Path } from "react-content-loader/native";

import { Rect, Circle } from "react-native-svg";
const TippingLoader = (props: any) => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    // width={"100%"}
    // height={"100%"}
    viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}>
    <Rect x="121" y="170" rx="3" ry="3" width="380" height="6" />
    <Rect x="575" y="238" rx="0" ry="0" width="5" height="4" />
    <Rect x="572" y="188" rx="0" ry="0" width="28" height="55" />
    <Rect x="582" y="231" rx="0" ry="0" width="3" height="7" />
    <Rect x="463" y="197" rx="0" ry="0" width="508" height="61" />
    <Rect x="569" y="233" rx="0" ry="0" width="25" height="5" />
    <Rect x="285" y="151" rx="0" ry="0" width="1" height="1" />
    <Rect x="7" y="98" rx="0" ry="0" width="39" height="22" />
    <Rect x="287" y="96" rx="0" ry="0" width="39" height="22" />
    <Circle cx="86" cy="105" r="24" />
    <Circle cx="247" cy="105" r="24" />
    <Circle cx="171" cy="108" r="9" />
    <Rect x="154" y="123" rx="0" ry="0" width="33" height="10" />
  </ContentLoader>
);

export default TippingLoader;
