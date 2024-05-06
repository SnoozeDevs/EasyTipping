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

export const GroupName = styled.Text`
font-size: 18px;
font-weight: 600;
`
export const LeagueName = styled.Text`
font-size: 14px;
text-transform: uppercase;
font-weight: 500;
`

export const GroupRank = styled.Text`
font-size: 18px;
font-weight: 600;
`

export const LeagueContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 20px;
  border-radius: 50px;
  background-color: #399fed75;
`

export const IconContainer = styled.View`
display: flex;
flex-direction: row;
gap: 4px;
`
