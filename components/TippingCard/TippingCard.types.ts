export interface ITippingCardProps {
  homeName: string,
  awayName: string,
  matchTiming: MatchTiming,
  stadium: string;
}

type MatchTiming = {
  matchDay: string;
  matchDate: string;
  matchTime: string;
}