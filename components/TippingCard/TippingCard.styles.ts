import styled from 'styled-components/native'

export const TippingCard = styled.View`
display: flex;
justify-content: space-around;
flex-direction: row;
width: 90%;
background-color: #fff;
border-radius: 16px;
align-items: center;
justify-content: center;
`

export const TeamContainer = styled.Pressable`
display: flex;
flex: 1;
flex-direction: row;
justify-content: center;
align-items: center;
gap: 6px;
padding: 4px;
border-radius: 16px;
/* background-color: #82dd82 */
`

export const TeamText = styled.Text`
font-size: 22px;
font-weight: 600;
`

export const InfoContainer = styled.View`
display: flex;
justify-content: space-evenly;
align-items: center;
`

export const Image = styled.Image`
width: 45px;
height: 45px;
object-fit: contain;
`