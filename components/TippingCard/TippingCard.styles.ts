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
`

export const TeamContainer = styled.Pressable`
display: flex;
flex: 1;
flex-direction: row;
justify-content: center;
align-items: center;
gap: 6px;
padding: 12px;
border-radius: 16px;
height: 100%;
`

export const HomeTeam = styled(TeamContainer) <{ $selected?: boolean; }>`
border-radius: 16px 0 0 16px;
background-color: ${props => props.$selected ? '#39A0ED' : 'transparent'}
`

export const AwayTeam = styled(TeamContainer) <{ $selected?: boolean; }>`
border-radius: 0 16px 16px 0;
background-color: ${props => props.$selected ? '#39A0ED' : 'transparent'}
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

export const VersusContainer = styled.View`
height: 28px;
width: 28px;
display: flex;
justify-content: center;
align-items: center;
border-radius: 14px;
background-color: #39A0ED;

/* position: absolute;
top: 33%; */
`

export const VersusText = styled.Text`
color: #fff;
font-weight: 800;
`

export const InformationText = styled.Text`
font-weight: 600;
text-align: center;
font-size: 11px;
`