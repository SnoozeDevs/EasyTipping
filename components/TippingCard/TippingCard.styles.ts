import styled from 'styled-components/native'

export const TippingCard = styled.View`
display: flex;
justify-content: space-between;
align-items: center;
flex-direction: row;
background-color: #fff;
border-radius: 16px;
align-items: center;
justify-content: center;
width: 100%;
max-height: 100px;
`

export const TeamContainer = styled.Pressable`
display: flex;
flex: 1;
flex-direction: row;
justify-content: center;
align-items: center;
gap: 6px;
padding: 8px;
border-radius: 16px;
height: 100%;
/* max-height: 50px; */
`

export const HomeTeam = styled(TeamContainer) <{ $selected?: boolean; $disabled?: boolean; $tipResult?: string }>`
border-radius: 16px 0 0 16px;
background-color: ${props => props.$disabled && props.$selected ? '#399fed75' : props.$selected ? '#39A0ED' : 'transparent'};
border:  ${props => returnBorderColour(props)};
`

export const AwayTeam = styled(TeamContainer) <{ $selected?: boolean; $disabled?: boolean; $tipResult?: string }>`
border-radius: 0 16px 16px 0;
background-color: ${props => props.$disabled && props.$selected ? '#399fed75' : props.$selected ? '#39A0ED' : 'transparent'};
border: ${props => returnBorderColour(props)};
`

export const TeamText = styled.Text`
font-size: 22px;
font-weight: 600;
`

export const InfoContainer = styled.View`
display: flex;
justify-content: space-between;
align-items: center;
width: 33%;
height: 100%;
padding: 3px 0;
`

export const Image = styled.Image`
width: 50px;
height: 50px;
object-fit: contain;
`

export const TipStatus = styled.View`

`

export const InformationText = styled.Text`
font-weight: 600;
text-align: center;
font-size: 11px;
`


const returnBorderColour = (props: any) => {
  if ((props.$tipResult === 'correct' || props.$tipResult === 'draw') && props.$selected) {
    return '3px solid #2db918'
  } else if (props.$tipResult === 'incorrect' && props.$selected) {
    return '3px solid #f52a14'
  } else if (props.$disabled && props.$selected) {
    return '3px solid #399fed75'

  } else {
    return '3px solid transparent'
  }
}