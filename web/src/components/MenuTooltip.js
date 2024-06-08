import React from 'react';
import styled from 'styled-components';
import { tooltipData } from '../constants/menu';
import TooltipButton from './buttons/TooltipButton';

export default function MenuToolTip(props) {
  const { isOpen } = props;
  return (
    <Wrapper isOpen={isOpen}>
      {tooltipData.map((item, index) => (
        <TooltipButton item={item} key={index} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: rgba(15, 14, 71, 0.3);
  box-shadow: 0px 50px 100px rgba(0, 0, 0, 0.25),
    inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 20px;
  position: absolute;
  top: 60px;
  right: 30px;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  display: grid;
  grid-template-columns: 150px;
  gap: 10px;
  z-index: 1;
  transition: 0.3s ease-in-out;
  /* display: ${(props) =>
    props.isOpen
      ? 'block'
      : 'none'}; */ /*using this because button still interactive even at opacity zero */
  visibility: ${(props) =>
    props.isOpen
      ? 'visible'
      : 'hidden'}; /*this is chosen over display since animations are not applied when we use display */
  transform: ${(props) =>
    props.isOpen
      ? 'skewY(0) rotate(0) translateY(0)'
      : 'skewY(-5deg) rotate(5deg) translateY(-30px)'};
`;
