import { Dispatch, SetStateAction } from "react";

export interface ITippingCardProps {
  matchData: MatchData;
  tipData: TipData;
}

export type MatchData = {
  homeName: string;
  awayName: string;
  matchTiming: MatchTiming;
  stadium: string;
  matchId: number;
  isFirstMatch?: boolean;
  setShowMarginSelector: Dispatch<SetStateAction<any>>;
}

export type TipData = {
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