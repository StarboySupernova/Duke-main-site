import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

export default function MenuButton(props) {
  const { item } = props;
  const [ishover, setIshover] = useState(false);

  function MouseOver() {
    setIshover(true);
  }
  function MouseOut() {
    setIshover(false);
  }

  return (
    <Link to={item.link} onClick={item.onClick}>
      <HoverWrapper
        isHover={ishover}
        onMouseEnter={() => MouseOver()}
        onMouseLeave={() => MouseOut()}
      >
        <MenuItem title={item.title}>
          <img src={item.icon} alt={item.title} />
          {item.title}
        </MenuItem>
      </HoverWrapper>
    </Link>
  );
}

/* setting grid inside extant MenuWrapper columns */
const MenuItem = styled.div`
  color: rgba(255, 255, 255, 0.7);
  display: grid;
  grid-template-columns: 24px auto;
  gap: ${(props) => (props.title ? '10px' : '0px')};
  align-items: center;
  padding: 5px;
  transition: 0.5s ease-out; /*transition should be applied to parent container & not hover state else the transition only occurs when mouse starts to hover, and not when it ends */
`;

const HoverWrapper = styled.div`
  border-radius: ${(props) => (props.isHover ? '10px' : '0px')};
  background: ${(props) =>
    props.isHover ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.0)'};
  box-shadow: ${(props) =>
    props.isHover
      ? '0px 10px 20px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.2)'
      : '0px 0px 0px rgba(0, 0, 0, 0.0), inset 0px 0px 0px 0px rgba(255, 255, 255, 0.0)'};
`;
