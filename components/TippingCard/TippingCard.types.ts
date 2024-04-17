import { Dispatch, SetStateAction } from "react";

export interface ITippingCardProps {
  homeName: string,
  awayName: string,
  matchTiming: MatchTiming,
  stadium: string;
  matchId: number;
  totalTips: Dispatch<SetStateAction<any>>;
  currentSelection: string;
  disabledTips?: boolean;
  tipResult?: string;
}

type MatchTiming = {
  matchDay: string;
  matchDate: string;
  matchTime: string;
}