import { Dispatch, SetStateAction } from "react";

export interface ITippingCardProps {
  homeName: string,
  awayName: string,
  matchTiming: MatchTiming,
  stadium: string;
  matchId: number;
  totalTips: Dispatch<SetStateAction<any>>;
}

type MatchTiming = {
  matchDay: string;
  matchDate: string;
  matchTime: string;
}