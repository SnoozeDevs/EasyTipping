import React from "react";
import { ISwiperProps } from "./Swiper.types";
import * as RNSwiper from "react-native-swiper";
import { Heading, SwiperContainer } from "./Swiper.styles";

const Swiper = ({ values, selected, startingIndex }: ISwiperProps) => {
  const swiperArray = values.map((value: any) => {
    return (
      <SwiperContainer key={`${value}`}>
        <Heading>Round {value}</Heading>
      </SwiperContainer>
    );
  });

  return (
    <RNSwiper.default
      buttonWrapperStyle={{
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 12,
        top: -12,
      }}
      index={startingIndex}
      loop={false}
      autoplay={false}
      showsButtons
      containerStyle={{
        maxHeight: 75,
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      onIndexChanged={(index: number) => {
        selected(values[index]);
      }}
      showsPagination={false}>
      {swiperArray}
    </RNSwiper.default>
  );
};

export default Swiper;
