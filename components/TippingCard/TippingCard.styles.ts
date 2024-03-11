import styled from 'styled-components/native'

export const TippingCard = styled.View`
display: flex;
justify-content: space-evenly;
flex-direction: row;
width: 95%;
background-color: lightgray;
padding: 8px;
border-radius: 16px;
box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.3);
`

export const TeamContainer = styled.View`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
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
width: 60px;
height: 60px;
object-fit: contain;
`