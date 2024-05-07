import styled from 'styled-components/native'

export const GroupCard = styled.TouchableOpacity`
  display: flex;
  background-color: #fff;
  padding: 20px;
  flex-direction: column;
  border-radius: 8px;
  gap: 20px;
`

export const GroupContentContainer = styled.View`
display: flex;
justify-content: space-between;
flex-direction: row;
align-items: center;
`

export const RoundRankContainer = styled(GroupContentContainer)`
align-items: flex-end;`

export const GroupName = styled.Text`
font-size: 18px;
font-weight: 600;
color: #3478F6;

`
export const LeagueName = styled.Text`
font-size: 16px;
text-transform: uppercase;
font-weight: 600;
color: #fff;
`

export const GroupRank = styled.View`
display: flex;
flex-direction: row;
align-items: center;
gap: 6px;
`

export const RankText = styled.Text`
font-size: 18px;
font-weight: 600;

`

export const LeagueContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 20px;
  border-radius: 50px;
  /* background-color: #399fed75; */
  background-color: #3478F6;
  flex-direction: row;
  gap: 6px;
`

export const IconContainer = styled.View`
display: flex;
flex-direction: row;
gap: 4px;
justify-content: flex-end;
`
export const GroupNameContainer = styled.View`
display: flex;
flex-direction: row;
gap: 6px;
align-items: center;`

export const RoundContainer = styled.View`
display: flex;
flex-direction: column;
gap: 6px;
align-items: flex-end;`

export const RoundText = styled.Text`
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
`