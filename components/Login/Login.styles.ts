import styled from 'styled-components/native'

export const Login = styled.View`
  background-color: transparent;
  flex: 1;
  align-items: center;
  justify-content: center;
  align-content: center;
  gap: 8px;
  padding: 60px;
`;

export const StyledLink = styled.Text`
  display: flex;
  text-align: center;
  font-size: 12px;
  color: #000000;
  text-decoration: underline;
`;

export const Error = styled.Text`
  color: red;
  font-size: 10px;
  text-align: left;
  width: 100%;
`;

export const InputContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;