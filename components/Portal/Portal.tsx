import { IPortalProps } from "./Portal.types";
import {
  Dialog,
  Portal as PaperPortal,
  Provider,
  TextInput,
} from "react-native-paper";
import { Text } from "react-native";
import Button from "../Button";

const Portal = ({ showPortal }: IPortalProps) => {
  return (
    <Provider>
      <PaperPortal>
        <Text>This is a portal</Text>
        <Button
          title="Show page"
          onPress={() => {
            showPortal(false);
          }}
        />
      </PaperPortal>
    </Provider>
  );
};

export default Portal;
