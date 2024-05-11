import styled from 'styled-components/native'
import Button from '../Button/Button';

export const TippingMenu = styled.View`
  flex: 1;
  padding: 5% 0 0 0;
  background-color: #f3f2f2e3;
`;

export const MatchText = styled.Text`
  font-family: "Montserrat";
  font-size: 20px;
  font-weight: 600;
`;

export const CardContainer = styled.View`
  display: flex;
  flex-direction: column;
`;

export const TipContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: center;
  flex: 1;
`;

export const ButtonContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const MarginButton = styled(Button)``;
