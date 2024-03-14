import { Dispatch, SetStateAction } from "react";

export interface ISwiperProps {
  values: any;
  selected: Dispatch<SetStateAction<any>>;
  startingIndex: number;
}